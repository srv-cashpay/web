import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const MerkDialog = ({ visible, onHide, unitData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Merk" modal onHide={onHide}>
            {/* Check if unitData is an array and contains rows */}
            <DataTable value={unitData?.data?.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="unit_name" header="Nama Merk" />
            </DataTable>
        </Dialog>
    );
};

export default MerkDialog;
