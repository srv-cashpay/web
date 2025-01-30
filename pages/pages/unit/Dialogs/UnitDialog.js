import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const UnitDialog = ({ visible, onHide, unitData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Unit" modal onHide={onHide}>
            {/* Check if unitData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={unitdata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={unitData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="unit_name" header="Nama Unit" />
            </DataTable>
        </Dialog>
    );
};

export default UnitDialog;
