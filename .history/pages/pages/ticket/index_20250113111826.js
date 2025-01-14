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
import withAuth from '../../../layout/context/withAuth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Calendar } from 'primereact/calendar';

const Ticket = () => {
    let emptyEmployee = {
        id: null,
        user :{
            full_name: '',
        },
        image: null,
        description: '',
        category: null,
        quantity: 0,
        status_account: false,
        salary: ''  // Add this line

    };

    const [employees, setEmployees] = useState(null);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
    const [employee, setEmployee] = useState(emptyEmployee);
    const [selectedEmployees, setSelectedEmployees] = useState(null);
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
                const response = await axios.get(`http://192.168.14.248:8080/api/v1/employee?page=${paginationData.page}&limit=${paginationData.limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                // Update employees and pagination data
                setEmployees(response.data.data);
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
        setEmployee(emptyEmployee);
        setSubmitted(false);
        setEmployeeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
    };

    const hideDeleteEmployeeDialog = () => {
        setDeleteEmployeeDialog(false);
    };

    const hideDeleteEmployeesDialog = () => {
        setDeleteEmployeesDialog(false);
    };

    const saveEmployee = () => {
       
            saveDataToApi();

        
    };

    const saveDataToApi = async () => {
        try {
            const token = getTokenFromCookie();
            
            // Assuming you want to send the `employee` state as the data payload
            const response = await axios.post(`http://192.168.14.248:8080/api/v1/employee`, employee, {
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
    

    const editEmployee = (employee) => {
        setEmployee({ ...employee });
        setEmployeeDialog(true);
    };

    const confirmDeleteEmployee = (employee) => {
        setEmployee(employee);
        setDeleteEmployeeDialog(true);
    };

    const deleteEmployee = () => {
        let _employees = employees.filter((val) => val.id !== employee.id);
        setEmployees(_employees);
        setDeleteEmployeeDialog(false);
        setEmployee(emptyEmployee);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === id) {
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
        setDeleteEmployeesDialog(true);
    };

    const deleteSelectedEmployees = () => {
        let _employees = employees.filter((val) => !selectedEmployees.includes(val));
        setEmployees(_employees);
        setDeleteEmployeesDialog(false);
        setSelectedEmployees(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employees Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _employee = { ...employee };
        _employee['category'] = e.value;
        setEmployee(_employee);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _employee = { ...employee };
        _employee[`${name}`] = val;

        setEmployee(_employee);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _employee = { ...employee };
        _employee[`${name}`] = val;

        setEmployee(_employee);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedEmployees || !selectedEmployees.length} />
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
                {rowData.user.full_name}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.created_by}
            </>
        );
    };

    const salaryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Salary</span>
                {rowData.salary}
            </>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Card ID</span>
                {rowData.id_card}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status_account ? 'Active' : 'Inactive'}
            </>
        );
    };
    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEmployee(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEmployee(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Employees</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const employeeDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
        </>
    );
    const deleteEmployeeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmployeeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEmployee} />
        </>
    );
    const deleteEmployeesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmployeesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEmployees} />
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
                        value={employees}
                        selection={selectedEmployees}
                        onSelectionChange={(e) => setSelectedEmployees(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        // paginatorTemplate={`FirstPageLink PrevPageLink PageLinks ${(paginationData.limit === 10 && paginationData.nextPage) ? paginationData.nextPage : ''} LastPageLink CurrentPageReport RowsPerPageDropdown`}

                        currentPageReportTemplate={`Showing {first} to {last} of  ${paginationData.totalData} products`}
                        globalFilter={globalFilter}
                        emptyMessage="No employees found."
                        header={header}
                        responsiveLayout="scroll"

                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Card ID" sortable body={idBodyTemplate} />
                        <Column field="full_name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status_account" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="salary" header="Salary" sortable body={salaryBodyTemplate} />

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={employeeDialog} style={{ width: '450px' }} header="Employee Details" modal className="p-fluid" footer={employeeDialogFooter} onHide={hideDialog}>
                        {employee.image && <img src={`${contextPath}/demo/images/employee/${employee.image}`} alt={employee.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="full_name">Full name</label>
                            <InputText id="full_name" value={employee.full_name} onChange={(e) => onInputChange(e, 'full_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.full_name })} />
                            {submitted && !employee.full_name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="id_card">ID Card</label>
                            <InputText id="id_card" value={employee.id_card} onChange={(e) => onInputChange(e, 'id_card')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.id_card })} />
                            {submitted && !employee.id_card && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="account_number">Bank Account Number</label>
                            <InputText id="account_number" value={employee.account_number} onChange={(e) => onInputChange(e, 'account_number')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.account_number })} />
                            {submitted && !employee.account_number && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ktp">Identity Number</label>
                            <InputText id="ktp" value={employee.ktp} onChange={(e) => onInputChange(e, 'ktp')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.ktp })} />
                            {submitted && !employee.ktp && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="salary">Salary</label>
                            <InputText id="salary" value={employee.salary} onChange={(e) => onInputChange(e, 'salary')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.salary })} />
                            {submitted && !employee.salary && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whasapp</label>
                            <InputText id="whatsapp" value={employee.whatsapp} onChange={(e) => onInputChange(e, 'whatsapp')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.whatsapp })} />
                            {submitted && !employee.whatsapp && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="place_of_birth">Place of birth</label>
                                <InputText id="place_of_birth" value={employee.place_of_birth} onValueChange={(e) => onInputChange(e, 'place_of_birth')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="date_of_birth">Date of birth</label>
                                <Calendar showIcon showButtonBar id="date_of_birth" value={employee.date_of_birth} onValueChange={(e) => setCalendarValue(e, 'date_of_birth')} integeronly />

                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="address">Address</label>
                            <InputTextarea id="address" value={employee.address} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label className="mb-3">User Account</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status_account1" name="status_account" value="Active" onChange={onCategoryChange} checked={employee.status_account === 'Active'} />
                                    <label htmlFor="status_account1">Active</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="status_account2" name="status_account" value="NonActive" onChange={onCategoryChange} checked={employee.status_account === 'NonActive'} />
                                    <label htmlFor="status_account2">Non Active</label>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={employee.user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.email })} />
                            {submitted && !employee.email && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <InputText id="password" value={employee.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !employee.password })} />
                            {submitted && !employee.password && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeeDialogFooter} onHide={hideDeleteEmployeeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employee && (
                                <span>
                                    Are you sure you want to delete <b>{employee.full_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeesDialogFooter} onHide={hideDeleteEmployeesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employee && <span>Are you sure you want to delete the selected employees?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Ticket);
