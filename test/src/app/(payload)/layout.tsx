/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import '@payloadcms/next/css';
import './custom.scss';

import configPromise from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => <RootLayout config={configPromise}>{children}</RootLayout>;

export default Layout;
