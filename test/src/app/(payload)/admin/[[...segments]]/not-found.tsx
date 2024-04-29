/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import config from '@payload-config';
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { generatePageMetadata,NotFoundPage } from '@payloadcms/next/views';
import type { Metadata } from 'next';

type Args = {
  params: {
    segments: string[];
  };
  searchParams: {
    [key: string]: string | string[];
  };
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

const NotFound = ({ params, searchParams }: Args) => NotFoundPage({ config, params, searchParams });

export default NotFound;
