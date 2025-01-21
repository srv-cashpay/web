import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';

function ReportData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Panggil API untuk mendapatkan data
    fetch('https://example.com/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  const columns = [
    {
      Header: 'Nama',
      accessor: 'nama'
    },
    {
      Header: 'Alamat',
      accessor: 'alamat'
    },
    {
      Header: 'Telepon',
      accessor: 'telepon'
    }
  ];

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="table"
        />
      )}
    </div>
  );
}

export default ReportData;