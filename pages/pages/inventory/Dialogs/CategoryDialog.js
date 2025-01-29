import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CategoryDialog = ({ visible, onHide, categoryData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Category" modal onHide={onHide}>
            {/* Check if categoryData is an array and contains rows */}
            <DataTable value={categoryData.data.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="category_name" header="Nama Category" />
            </DataTable>
        </Dialog>
    );
};

export default CategoryDialog;
