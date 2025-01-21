import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PermissionDialog = ({ visible, onHide, PermissionData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Permission" modal onHide={onHide}>
            {/* Check if PermissionData is an array and contains rows */}
            <DataTable value={PermissionData?.data?.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="Permission" header="Nama Permission" />
            </DataTable>
        </Dialog>
    );
};

export default PermissionDialog;
