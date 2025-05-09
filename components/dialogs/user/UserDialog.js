import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UserDialog = ({ visible, onHide, UserData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar User" modal onHide={onHide}>
            <DataTable value={UserData.data.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="User" header="Nama User" />
            </DataTable>
        </Dialog>
    );
};

export default UserDialog;
