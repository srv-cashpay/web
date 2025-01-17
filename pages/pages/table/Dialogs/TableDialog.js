import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableDialog = ({ visible, onHide, tableData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Table" modal onHide={onHide}>
            {/* Check if tableData is an array and contains rows */}
            <DataTable value={tableData?.data?.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="table" header="Nama Table" />
            </DataTable>
        </Dialog>
    );
};

export default TableDialog;
