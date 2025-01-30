import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const RoleDialog = ({ visible, onHide, RoleData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Role" modal onHide={onHide}>
            {/* Check if RoleData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={Roledata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={RoleData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="Role" header="Nama Role" />
            </DataTable>
        </Dialog>
    );
};

export default RoleDialog;
