import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import withAuth from '../../../layout/context/withAuth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Calendar } from 'primereact/calendar';

const Attendance = () => {
    let emptyAttendance = {
        id: null,
        user :{
            full_name: '',
        },
        image: null,
        description: '',
        category: null,
        quantity: 0,
        tap_in: false,
        salary: ''  // Add this line

    };

    const [attendances, setAttendances] = useState(null);
    const [attendanceDialog, setAttendanceDialog] = useState(false);
    const [deleteAttendanceDialog, setDeleteAttendanceDialog] = useState(false);
    const [deleteAttendancesDialog, setDeleteAttendancesDialog] = useState(false);
    const [attendance, setAttendance] = useState(emptyAttendance);
    const [selectedAttendances, setSelectedAttendances] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [calendarValue, setCalendarValue] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const getTokenFromCookie = () => {
        const token = Cookies.get('token'); // <-- Replace 'yourCookieName' with the actual name of your cookie

        return token;
    };

    const [paginationData, setPaginationData] = useState({
        page: 0,
        totalPages: 0,
        limit: 0,
        totalData: 0,
        totalRows: 0,
        nextPage: 0

    });
    
    
   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getTokenFromCookie();
                const response = await axios.get(`http://localhost:8080/api/v1/attendance?page=${paginationData.page}&limit=${paginationData.limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                // Update attendances and pagination data
                setAttendances(response.data.data);
                setPaginationData({
                    ...paginationData,
                    totalPages: Math.ceil(response.data.total_data / paginationData.limit),
                    totalData: response.data.total_data,  // Ambil totalData dari respons
                    nextPage: response.data.next_page,
                    totalRows: response.data.total_rows,
                    limit:response.data.total_data
                    
                });
    
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [paginationData.page, paginationData.limit]);

  

    const openNew = () => {
        setAttendance(emptyAttendance);
        setSubmitted(false);
        setAttendanceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAttendanceDialog(false);
    };

    const hideDeleteAttendanceDialog = () => {
        setDeleteAttendanceDialog(false);
    };

    const hideDeleteAttendancesDialog = () => {
        setDeleteAttendancesDialog(false);
    };

    const saveAttendance = () => {
       
            saveDataToApi();

        
    };

    const saveDataToApi = async () => {
        try {
            const token = getTokenFromCookie();
            
            // Assuming you want to send the `attendance` state as the data payload
            const response = await axios.post(`http://localhost:8080/api/v1/attendance`, attendance, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: response.data.message, life: 3000 });
                // You can update the UI or perform other actions upon successful save
            }
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };
    

    const editAttendance = (attendance) => {
        setAttendance({ ...attendance });
        setAttendanceDialog(true);
    };

    const confirmDeleteAttendance = (attendance) => {
        setAttendance(attendance);
        setDeleteAttendanceDialog(true);
    };

    const deleteAttendance = () => {
        let _attendances = attendances.filter((val) => val.id !== attendance.id);
        setAttendances(_attendances);
        setDeleteAttendanceDialog(false);
        setAttendance(emptyAttendance);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Attendance Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < attendances.length; i++) {
            if (attendances[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteAttendancesDialog(true);
    };

    const deleteSelectedAttendances = () => {
        let _attendances = attendances.filter((val) => !selectedAttendances.includes(val));
        setAttendances(_attendances);
        setDeleteAttendancesDialog(false);
        setSelectedAttendances(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Attendances Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _attendance = { ...attendance };
        _attendance['category'] = e.value;
        setAttendance(_attendance);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _attendance = { ...attendance };
        _attendance[`${name}`] = val;

        setAttendance(_attendance);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _attendance = { ...attendance };
        _attendance[`${name}`] = val;

        setAttendance(_attendance);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedAttendances || !selectedAttendances.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.user?.full_name}
            </>
        );
    };

    const tap_in_atBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.tap_in_at}
            </>
        );
    };

    const tap_out_atBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.tap_out_at}
            </>
        );
    };

    const tapoutBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Salary</span>
                {rowData.tap_out}
            </>
        );
    };

    const tapinBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.tap_in}
            </>
        );
    };
    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAttendance(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteAttendance(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Attendances</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const attendanceDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAttendance} />
        </>
    );
    const deleteAttendanceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAttendanceDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteAttendance} />
        </>
    );
    const deleteAttendancesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAttendancesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedAttendances} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={attendances}
                        selection={selectedAttendances}
                        onSelectionChange={(e) => setSelectedAttendances(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        // paginatorTemplate={`FirstPageLink PrevPageLink PageLinks ${(paginationData.limit === 10 && paginationData.nextPage) ? paginationData.nextPage : ''} LastPageLink CurrentPageReport RowsPerPageDropdown`}

                        currentPageReportTemplate={`Showing {first} to {last} of  ${paginationData.totalData} products`}
                        globalFilter={globalFilter}
                        emptyMessage="No attendances found."
                        header={header}
                        responsiveLayout="scroll"

                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="full_name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="tap_in" header="Tap In" body={tapinBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="tap_in_at" header="Tap In At" sortable body={tap_in_atBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="tap_out" header="Tap Out" sortable body={tapoutBodyTemplate} />
                        <Column field="tap_out_at" header="Tap In At" sortable body={tap_out_atBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={attendanceDialog} style={{ width: '450px' }} header="Attendance Details" modal className="p-fluid" footer={attendanceDialogFooter} onHide={hideDialog}>
                        {attendance.image && <img src={`${contextPath}/demo/images/attendance/${attendance.image}`} alt={attendance.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="full_name">Full name</label>
                            <InputText id="full_name" value={attendance.full_name} onChange={(e) => onInputChange(e, 'full_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.full_name })} />
                            {submitted && !attendance.full_name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="id_card">ID Card</label>
                            <InputText id="id_card" value={attendance.id_card} onChange={(e) => onInputChange(e, 'id_card')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.id_card })} />
                            {submitted && !attendance.id_card && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="account_number">Bank Account Number</label>
                            <InputText id="account_number" value={attendance.account_number} onChange={(e) => onInputChange(e, 'account_number')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.account_number })} />
                            {submitted && !attendance.account_number && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ktp">Identity Number</label>
                            <InputText id="ktp" value={attendance.ktp} onChange={(e) => onInputChange(e, 'ktp')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.ktp })} />
                            {submitted && !attendance.ktp && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="salary">Salary</label>
                            <InputText id="salary" value={attendance.salary} onChange={(e) => onInputChange(e, 'salary')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.salary })} />
                            {submitted && !attendance.salary && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whasapp</label>
                            <InputText id="whatsapp" value={attendance.whatsapp} onChange={(e) => onInputChange(e, 'whatsapp')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.whatsapp })} />
                            {submitted && !attendance.whatsapp && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="place_of_birth">Place of birth</label>
                                <InputText id="place_of_birth" value={attendance.place_of_birth} onValueChange={(e) => onInputChange(e, 'place_of_birth')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="date_of_birth">Date of birth</label>
                                <Calendar showIcon showButtonBar id="date_of_birth" value={attendance.date_of_birth} onValueChange={(e) => setCalendarValue(e, 'date_of_birth')} integeronly />

                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="address">Address</label>
                            <InputTextarea id="address" value={attendance.address} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label className="mb-3">User Account</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status_account1" name="status_account" value="Active" onChange={onCategoryChange} checked={attendance.status_account === 'Active'} />
                                    <label htmlFor="status_account1">Active</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status_account2" name="status_account" value="NonActive" onChange={onCategoryChange} checked={attendance.status_account === 'NonActive'} />
                                    <label htmlFor="status_account2">Non Active</label>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={attendance.user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.email })} />
                            {submitted && !attendance.email && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" value={attendance.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !attendance.password })} />
                            {submitted && !attendance.password && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAttendanceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAttendanceDialogFooter} onHide={hideDeleteAttendanceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {attendance && (
                                <span>
                                    Are you sure you want to delete <b>{attendance.full_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAttendancesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAttendancesDialogFooter} onHide={hideDeleteAttendancesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {attendance && <span>Are you sure you want to delete the selected attendances?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Attendance);
