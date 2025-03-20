import {useEffect, useState} from 'react'
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import './App.css'

const titles = {
    'nomer_dogovora' : 'Номер договора',
    'FIO' :  'ФІО',
    'RNOO' : 'РНОО',
    'nomer_pasporta' : 'Номер паспорта',
    'vidaniy' : 'Виданий',
    'date' : 'Дата',
    'propiska' : 'Прописка',
    'number' : 'Номер',
    'FIO_KOROTKO' : 'ФІО коротко',
    'Nomer_dogovory_vid_date' : 'Номер договору від дати',
    'marka' : 'Марка',
    'model' : 'Модель',
    'year' : 'Рік',
    'VIN' : 'ВІН',
    'price' : 'ціна'
};

const init = {
    'nomer_dogovora' : '',
    'FIO' :  '',
    'RNOO' : '',
    'nomer_pasporta' : '',
    'vidaniy' : '',
    'date' : '',
    'propiska' : '',
    'number' : '',
    'FIO_KOROTKO' : '',
    'Nomer_dogovory_vid_date' : '',
    'marka' : '',
    'model' : '',
    'year' : '',
    'VIN' : '',
    'price' : ''
}

const initialData = () => {
    const data = localStorage.getItem('data');
    const result =  data ? JSON.parse(data) : { ...init }

    return { ...init, ...result }
}

function App() {
  const [data, setData] = useState(initialData());

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target.result;
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip);

                // Replace placeholders in the docx
                doc.render(data);

                const updatedBlob = new Blob([doc.getZip().generate({ type: 'arraybuffer' })], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                saveAs(updatedBlob, 'updated.docx');
            } catch (error) {
                console.error('Error processing DOCX:', error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

  return (
      <>
          {Object.keys(data).map((key) => {
              return (
                  <div key={key} style={{display: 'flex', justifyContent: 'flex-start', marginTop: 12}}>
                      <label style={{width: 220}}>{titles[key]}</label>
                      <input type="text" value={data[key]} onChange={(e) => {
                          setData({...data, [key]: e.target.value})
                      }}/>
                  </div>
              )
          })}
          <button style={{marginTop: 12 }} onClick={() => {
              setData({...init})
            }}>Очистити</button>
          <input type="file" id="actual-btn" style={{marginTop: 12, marginLeft: 12 }} onChange={handleFileUpload}/>
      </>
  )
}

export default App
