declare module 'react' {
  export = React;
  export as namespace React;
  const React: any;
}

declare module 'next/head' {
  import { Component } from 'react';
  export default class Head extends Component<any> {}
}

declare module 'next' {
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?(context: any): Promise<IP>;
  };

  export interface GetServerSideProps {
    (context: any): Promise<{
      props?: any;
      notFound?: boolean;
      redirect?: {
        destination: string;
        permanent: boolean;
      };
    }>;
  }
}

declare module 'next/image' {
  import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    quality?: number;
  }

  export default function Image(props: ImageProps): JSX.Element;
}

declare module 'graphql-request' {
  export class GraphQLClient {
    constructor(endpoint: string, options?: any);
    request<T = any>(query: string, variables?: any): Promise<T>;
  }
  export function gql(strings: TemplateStringsArray, ...values: any[]): string;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 