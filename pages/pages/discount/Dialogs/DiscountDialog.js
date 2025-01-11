import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DiscountDialog = ({ visible, onHide, discountData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Discount" modal onHide={onHide}>
            {/* Check if discountData is an array and contains rows */}
            <DataTable value={discountData?.data?.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="discount_name" header="Nama Discount" />
                <Column field="discount_percentage" header="Discount Persen" />
            </DataTable>
        </Dialog>
    );
};

export default DiscountDialog;
