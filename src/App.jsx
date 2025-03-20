import {useEffect, useState} from 'react'
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import './App.css'

/*
npm run dev

git add .
git commit -m 'message'
git push origin main

npm run deploy
*/

const titles = {
    'nomer_dogovora' : 'Номер договору',
    'FIO' :  'Фамілія Імʼя По-батькові',
    'RNOO' : 'Код платника податків',
    'nomer_pasporta' : 'Номер паспорта',
    'vidaniy' : 'Орган та дата видачі паспорта',
    'date' : 'Дата договору',
    'date2': 'Дата + 6 місяців',
    'propiska' : 'Місце реєстрації клієнта',
    'number' : 'Номер телефону',
    'FIO_KOROTKO' : 'Фамілія та ініціали',
    'Nomer_dogovory_vid_date' : 'Для страхування, договір номер від дати..',
    'marka' : 'Марка авто',
    'model' : 'Модель авто',
    'year' : 'Рік авто',
    'VIN' : 'ВІН-код авто',
    'price' : 'Ціна авто'
};

const init = {};
Object.keys(titles).forEach(key => {
    init[key] = '';
});

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
                      <label style={{width: 300}}>{titles[key]}</label>
                      <input style={{ width: 900}} type="text" value={data[key]} onChange={(e) => {
                          setData({...data, [key]: e.target.value})
                      }}/>
                  </div>
              )
          })}
          <button style={{marginTop: 12 }} onClick={() => {
              setData({...init})
            }}>Очистити</button>
          <input
              onClick={(e) => {
                e.target.value = null;
            }} type="file" id="actual-btn" style={{marginTop: 12, marginLeft: 12 }} onChange={handleFileUpload}/>
      </>
  )
}

export default App
