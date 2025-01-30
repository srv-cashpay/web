import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const MerkDialog = ({ visible, onHide, merkData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Merk" modal onHide={onHide}>
            {/* Check if merkData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={merkdata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={merkData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="merk_name" header="Nama Merk" />
            </DataTable>
        </Dialog>
    );
};

export default MerkDialog;
