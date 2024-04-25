/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            
            <img src={`/layout/images/ClickVital-LOGO${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} width="47.22px" height={'35px'} alt="logo" />
            by
            <span className="font-medium ml-2">Click Vital</span>
        </div>
    );
};

export default AppFooter;
