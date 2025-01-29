import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const MerkDialog = ({ visible, onHide, merkData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Merk" modal onHide={onHide}>
            {/* Check if merkData is an array and contains rows */}
            <DataTable value={merkData.data.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="merk_name" header="Nama Merk" />
            </DataTable>
        </Dialog>
    );
};

export default MerkDialog;
