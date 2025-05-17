import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PaymentDialog = ({ visible, onHide, paymentData }) => {
    return (
        <Dialog visible={visible} style={{ width: '50vw' }} header="Daftar Payment" modal onHide={onHide}>
            <DataTable value={paymentdata.data.rows || []} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="payment_name" header="Nama Payment" />
                <Column field="payment_percentage" header="Payment Persen" />
            </DataTable>
        </Dialog>
    );
};

export default PaymentDialog;
