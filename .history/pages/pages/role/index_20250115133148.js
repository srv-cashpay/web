import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import withAuth from '../../../layout/context/withAuth';
import { Dropdown } from 'primereact/dropdown'; 
import { fetchUsers, createUser,updateExistingUser, bulkDeleteUsers } from './api'; // Pastikan jalur ini sesuai
import { deleteUser as deleteUserById } from './api';
import UserCreateDialog from './Dialogs/UserCreateDialog';  // Import komponen UserDialog
import UserUpdateDialog from './Dialogs/UserUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyUser = {
        id: null,
        role :{
            role: '',
        },
        status: 0,
        description: ''
    }; 

    const [roles, setUsers] = useState(null);
    const [roleDialog, setUserDialog] = useState(false);
    const [roleUpdateDialog, setUserUpdateDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [role, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideUserDialog = () => {
        setShowUserDialog(false);
    };
    
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPaginationData(prev => ({ ...prev, limit: newRowsPerPage, page: 1 })); // Reset ke halaman 1 saat limit berubah
    };
    
    const [paginationData, setPaginationData] = useState({
        page: 1, // Start from page 1 as per your requirement
        totaPages: 0,
        limit: 10, // Default limit to 10
        totalData: 0,
        totalRows: 0,
        nextPage: 0,
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchUsers({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setUsers(Array.isArray(response.rows) ? response.rows : []);

                setPaginationData(prev => ({
                    ...prev,
                    totalPages: response.total_page,  // Ambil total halaman dari respons API
                    totalData: response.total_data,
                    totalRows: response.total_rows,
                    nextPage: response.next_page
                    
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        console.log("Updated Pagination Data:", paginationData);  // Log setiap kali paginationData berubah

    }, [paginationData.page, rowsPerPage, paginationData.totalPages]); 
   

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const openEdit = (roleData) => {
        setUser({ ...roleData });
        setSubmitted(false);
        setUserUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setUserUpdateDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createUser(role);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateUser = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingUser(role); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.meta?.message, life: 3000 });
        }
    };

    const confirmDeleteUser = (role) => {
        setUser(role);
        setDeleteUserDialog(true);
    };
    
    const deleteUser = async () => {
        try {
            await deleteUserById(role.id); // Use the renamed function to delete by id
            const _roles = roles.filter((val) => val.id !== role.id);
            setUsers(_roles);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting role:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete role', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const bulkDeleteSelectedUsers = async () => {
        try {
            const selectedUserIds = selectedUsers.map((role) => role.id);
            await bulkDeleteUsers(selectedUserIds);
            const _roles = roles.filter((role) => !selectedUserIds.includes(role.id));
            setUsers(_roles);
            setDeleteUsersDialog(false);
            setSelectedUsers(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting roles:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete roles', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
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
            <span
            style={{
                cursor: 'pointer',
                color: 'blue',
                
            }}
            onClick={() => openEdit(rowData)}
        >
            {rowData.full_name}
        </span>
        );
    };

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.created_by}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <Badge
                    value={rowData.status === 1 ? 'Active' : 'Inactive'}
                    severity={rowData.status === 1 ? 'success' : 'danger'}
                    className="ml-2"
                />
            </>
        );
    };  

    const handleNextPage = () => {
        setPaginationData(prev => {
            const nextPage = prev.page + 1;
            return { ...prev, page: nextPage > prev.totalPages ? prev.totalPages : nextPage };
        });
    };
    const handlePreviousPage = () => {
        setPaginationData(prev => {
            const previousPage = prev.page - 1;
            return { ...prev, page: previousPage < 1 ? 1 : previousPage };
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-1" onClick={() => openEdit (rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedUsers} />

        </>
    );

    const nomorBodyTemplate = (_, { rowIndex }) => {
        // Calculate the row number based on the current page and rows per page
        const nomor = (paginationData.page - 1) * rowsPerPage + rowIndex + 1;
        return (
            <span>{nomor}</span>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                       ref={dt}
                       value={roles}
                       selection={selectedUsers}
                       onSelectionChange={(e) => setSelectedUsers(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No roles found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />

                        <Column field="role" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={roleBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Users`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <UserCreateDialog
                        visible={roleDialog}
                        role={role}
                        setUser={setUser}
                        hideDialog={hideDialog}
                        saveUser={saveUser}
                        submitted={submitted}
                        />
                         <UserUpdateDialog
                            visible={roleUpdateDialog}
                            role={role}
                            setUser={setUser}
                            hideDialog={hideUpdateDialog}
                            updateUser={updateUser}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {role && (
                                <span>
                                    Are you sure you want to delete <b>{role.role}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {role && <span>Are you sure you want to delete the selected roles?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
