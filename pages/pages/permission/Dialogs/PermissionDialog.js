import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PermissionDialog = ({ visible, onHide, PermissionData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Permission" modal onHide={onHide}>
            {/* Check if PermissionData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={Permissiondata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={PermissionData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="Permission" header="Nama Permission" />
            </DataTable>
        </Dialog>
    );
};

export default PermissionDialog;
