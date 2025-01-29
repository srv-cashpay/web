import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UnitDialog = ({ visible, onHide, unitData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Unit" modal onHide={onHide}>
            {/* Check if unitData is an array and contains rows */}
            <DataTable value={unitData.data.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="unit_name" header="Nama Unit" />
            </DataTable>
        </Dialog>
    );
};

export default UnitDialog;
