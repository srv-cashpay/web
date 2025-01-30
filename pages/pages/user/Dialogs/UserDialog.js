import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UserDialog = ({ visible, onHide, UserData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar User" modal onHide={onHide}>
            {/* Check if UserData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={Userdata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={UserData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="User" header="Nama User" />
            </DataTable>
        </Dialog>
    );
};

export default UserDialog;
