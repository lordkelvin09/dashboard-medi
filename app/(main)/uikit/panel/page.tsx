'use client';

import React, { useRef } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Menu } from 'primereact/menu';
import Search from './search/search'
import styles from './products.module.css'
import Link from 'next/link'
import Pagination from './pagination/pagination'

const PanelDemo = () => {
    const menu1 = useRef<Menu>(null);
    const toolbarItems = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-sync'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];

    const toolbarLeftTemplate = () => {
        return (
            <>
                <Button label="New" icon="pi pi-plus" style={{ marginRight: '.5em' }} />
                <Button label="Open" icon="pi pi-folder-open" severity="secondary" />

                <i className="pi pi-bars p-toolbar-separator" style={{ marginRight: '.5em' }}></i>

                <Button icon="pi pi-check" severity="success" style={{ marginRight: '.5em' }} />
                <Button icon="pi pi-trash" severity="warning" style={{ marginRight: '.5em' }} />
                <Button icon="pi pi-print" severity="danger" />
            </>
        );
    };
    const toolbarRightTemplate = <SplitButton label="Options" icon="pi pi-check" model={toolbarItems} menuStyle={{ width: '12rem' }}></SplitButton>;
    const cardHeader = (
        <div className="flex align-items-center justify-content-between mb-0 p-3 pb-0">
            <h5 className="m-0">Card</h5>
            <Button icon="pi pi-plus" text onClick={(event) => menu1.current?.toggle(event)} />
            <Menu
                ref={menu1}
                popup
                model={[
                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                    { label: 'Remove', icon: 'pi pi-fw pi-minus' },
                    { label: 'Update', icon: 'pi pi-fw pi-sync' }
                ]}
            />
        </div>
    );

    return (
        <div className="grid">
            {/* <div className="col-12">
                <div className="card">
                    <h5>Toolbar</h5>
                    <Toolbar start={toolbarLeftTemplate} end={toolbarRightTemplate}></Toolbar>
                </div>
            </div> */}
            <div className={`${styles.container} bg-gray-900 w-full`}>
      <div className={styles.top}>
        <Search placeholder='Search for a user...'/>
        <Link href='/dashboard/products/add'>
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Identification</td>
            <td>Created At</td>
            <td>Specialty</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>
                Jhon Doe
              </div>
            </td>
            <td>13042024</td>
            <td>22/04/2024</td>
            <td>Master in S.E</td>
            <td>Active</td>
            <td>
              <div className={styles.buttons}>
                <Link href='/unkit/panel/add'>
                  <button className={`${styles.button} ${styles.view}`}>View</button>
                </Link>
                  <button className={`${styles.button} ${styles.delete}`}>Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination/>
            </div>
        </div>
    );
};

export default PanelDemo;
