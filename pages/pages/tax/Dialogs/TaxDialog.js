import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TaxDialog = ({ visible, onHide, taxData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Tax" modal onHide={onHide}>
            {/* Check if taxData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={taxdata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={taxData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="tax" header="Nama Tax" />
                <Column field="tax_percentage" header="Tax Persen" />
            </DataTable>
        </Dialog>
    );
};

export default TaxDialog;
