import { InternalServerErrorException } from '@nestjs/common';
import { Exception500 } from '../types/enums';
import { parse } from 'svg-parser';
import { v4 as uidv4 } from 'uuid';
import camelCase from 'lodash.camelcase';

enum Type {
  element = 'element',
}
enum TagName {
  g = 'g',
  svg = 'svg',
  text = 'text',
  path = 'path',
  circle = 'circle',
  metadata = 'metadata',
}

type SeatProperties = Partial<{
  component: 'sector' | 'row' | 'seat';
  sector: string | number;
  sectorName: string | number;
  rowName: string | number;
  name: string | number;
  multi: boolean;
  id: string | number;
}>;

type Properties = Partial<{
  id: string;
  version: 1.1;
  viewBox: string;
  width: number;
  height: number;
  'xml:space': 'preserve';
  xmlns: 'http://www.w3.org/2000/svg';
  'xmlns:xlink': 'http://www.w3.org/1999/xlink';
  x: string;
  y: string;
}>;

type XMLType = {
  type: Type;
  tagName: TagName;
  properties: Properties;
  children: XMLType[];
  metadata?: string;
};
type XMLSeat = {
  type: Type;
  tagName: TagName;
  properties: SeatProperties;
  children: XMLType[];
  metadata?: string;
};

export function mapSVGParser(buffer: Buffer, prev = null) {
  try {
    if (!buffer) {
      throw new InternalServerErrorException(Exception500.parseSVGError);
    }
    const xml = parse(buffer.toString())?.children as XMLType[];
    if (!xml) {
      throw new InternalServerErrorException(Exception500.parseSVGError);
    }

    const accumulator = prev ? prev : { background: [] };
    // eslint-disable-next-line no-inner-declarations
    function rePropsFc({ children, properties, ...props }: XMLType): XMLType {
      let newChildren = [] as XMLType[];

      if (children?.length) {
        newChildren = children.map(rePropsFc);
      }

      return {
        ...props,
        children: newChildren,
        properties: propertiesToCamelCase(properties),
      };
    }

    for (const data of xml) {
      const { properties, metadata } = data;
      // root document tagName=svg
      accumulator.attributes = properties;
      accumulator.xml = metadata;
      accumulator.width = properties.width;
      accumulator.height = properties.height;
      accumulator.viewBox = properties.viewBox;

      for (const elem of data.children) {
        const { tagName, properties, children } = elem;
        switch (tagName) {
          // svg metadata document
          case 'metadata':
            accumulator.metadata = elem;
            break;
          // map elements
          case 'g':
            switch (properties.id) {
              // здесь нет break; это правильно
              case 'background':
                accumulator.paths = children.map(({ tagName, properties }) => ({
                  tagName,
                  ...propertiesToCamelCase(properties),
                }));
              // eslint-disable-next-line no-fallthrough
              case 'details':
                accumulator.background.push(...children.map(rePropsFc));
                break;
              case 'seats':
                accumulator.seats = children.flatMap(
                  // sector props
                  ({
                    children,
                    properties: { component, ...sectorProperties },
                  }: XMLSeat) =>
                    children.flatMap(
                      // row props
                      ({
                        children,
                        properties: { component, ...rowProperties },
                      }: XMLSeat) =>
                        children.flatMap(
                          // seat props
                          ({ properties, tagName }: XMLSeat) => ({
                            ...propertiesToCamelCase(sectorProperties),
                            ...propertiesToCamelCase(rowProperties),
                            ...propertiesToCamelCase(properties),
                            tagName,
                            uid: uidv4(),
                          }),
                        ),
                    ),
                );
                break;
            }
            break;
        }
      }

      return accumulator;
    }
  } catch (e) {
    console.log(e);
  }
}

function propertiesToCamelCase(props) {
  return Object.fromEntries(
    Object.entries(props || {}).map(([key, element]) => [
      camelCase(key),
      element,
    ]),
  );
}
