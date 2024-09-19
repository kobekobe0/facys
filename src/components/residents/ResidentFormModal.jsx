import axios from 'axios';
import React from 'react';
import API_URL from '../../constants/api';

const FormDisplay = ({ form }) => {
    const renderFormFields = (data, level = 0) => {
      return Object.keys(data).map(key => {
        //do not render _id and image
        if (key === '_id' || key === 'image' || key === '_v' || key === 'picture') {
          return null;
        }

        //if value is undefined, do not render
        if(!data[key]) {
          return null;
        }

        if (data[key] !== undefined) {
          if (typeof data[key] === 'object' && !Array.isArray(data[key]) && data[key] !== null && !(data[key] instanceof Date)) {
            return (
              <tr key={key} style={{ borderBottom: '1px solid black' }}>
                <td style={{ paddingLeft: `` }}>
                  <strong>{key}: </strong>
                </td>
                <td>
                  <table>
                    <tbody>
                      {renderFormFields(data[key], level + 1)}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          }
          return (
            <tr key={key} style={{ borderBottom: '' }}>
              <td>
                <strong className='text-sm font-bold mr-6'>{key}:</strong>
              </td>
              <td>{data[key] instanceof Date ? new Date(data[key]?.toLocaleString('en-us', {year: 'numeric', month: 'long', day:'2-digit'})) : data[key]?.toString()}</td>
            </tr>
          );
        }
        return null;
      });
    };
  
    return (
      <div>
        <h2 className='font-medium'>Form Details</h2>
        <hr className='my-4 bg-gray-500 text-gray-500 h-[1.5px]' />
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {renderFormFields(form)}
          </tbody>
        </table>
      </div>
    );
  };
  


const ResidentFormModal = ({onClose, form, print}) => {
  const handlePrint =  async () => {
      try{
          const isConfirmed = await confirm('Are you sure you want to generate this document?');
          if (!isConfirmed) return;
          
          const response = await axios.get(`${API_URL}form/reprint/${form._id}`, {
              responseType: 'arraybuffer' 
          })
          console.log(response)
          //download the docx file
          const file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
          const fileURL = URL.createObjectURL(file);

          const link = document.createElement('a');
          link.href = fileURL;
          link.download = `${form._id}.docx`;
          link.click();
      } catch (error) {
          console.error(error)
      }
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom pb-4 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-fit sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <FormDisplay form={form} />
                        <div className='py-4 w-full flex items-center justify-end gap-4'>
                            {
                              print == false ? (
                                null
                              ) : (
                                <button onClick={handlePrint} className='bg-blue-500 hover:bg-blue-600 transition-all text-white p-2 w-1/6 rounded-md'>Print</button>
                              )
                            }
                            <button onClick={onClose} className='bg-red-500 hover:bg-red-600 transition-all text-white p-2 w-1/6 rounded-md'>Close</button>
                        </div>
                    </div>
                </div>
        </div>
    </div>
  );
};

export default ResidentFormModal;
