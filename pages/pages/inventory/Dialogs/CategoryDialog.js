import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CategoryDialog = ({ visible, onHide, categoryData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Category" modal onHide={onHide}>
            {/* Check if categoryData is an array and contains rows */}
<<<<<<< HEAD
            <DataTable value={categorydata.data.rows || []} responsiveLayout="scroll">
=======
            <DataTable value={categoryData.data.rows || []} responsiveLayout="scroll">
>>>>>>> 5d62ccc8800630bf10a0b63a1c38d4a0afe417af
                <Column field="id" header="ID" />
                <Column field="category_name" header="Nama Category" />
            </DataTable>
        </Dialog>
    );
};

export default CategoryDialog;
