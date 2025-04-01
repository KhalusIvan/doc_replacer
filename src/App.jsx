import {useEffect, useState} from 'react'
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import './App.css'

/*
npm run dev

git pull origin main

git add .
git commit -m 'message'
git push origin main

npm run deploy
*/

const documentTypes = {
    'america': "Америка",
    'europe': "Європа",
}

const titles = {
    'nomer_dogovora' : {
        name: 'Номер договору',
        types: ['america', 'europe']
    },
    'FIO' :  {
        name: 'Фамілія Імʼя По-батькові',
        types: ['america', 'europe']
    },
    'RNOO' : {
        name: 'Код платника податків',
        types: ['america', 'europe']
    },
    'nomer_pasporta' : {
        name: 'Номер паспорта',
        types: ['america', 'europe']
    },
    'vidaniy' : {
        name: 'Ким виданий паспорт',
        types: ['america', 'europe']
    },
    'date_vidachi' : {
        name: 'Дата видачі паспорта',
        types: ['america', 'europe']
    },
    'date' : {
        name: 'Дата договору',
        types: ['america', 'europe']
    },
    'date2': {
        name: 'Дата + 6 місяців у форм. хх.хх.хххх',
        types: ['america', 'europe']
    },
    'propiska' : {
        nam: 'Місце реєстрації клієнта',
        types: ['america', 'europe']
    },
    'number' : {
        name: 'Номер телефону',
        types: ['america', 'europe']
    },
    'FIO_KOROTKO' : {
        name: 'Фамілія та ініціали',
        types: ['america', 'europe']
    },
    'Nomer_dogovory_vid_date' : {
        name: 'Для страхування, договір номер від дати..',
        types: ['america', 'europe']
    },
    'marka' : {
        name: 'Марка авто',
        types: ['america', 'europe']
    },
    'model' : {
        name: 'Модель авто',
        types: ['america', 'europe']
    },
    'year' : {
        name: 'Рік авто',
        types: ['america', 'europe']
    },
    'VIN' : {
        name: 'ВІН-код авто',
        types: ['america', 'europe']
    },
    'price' : {
        name: 'Ціна авто',
        types: ['america', 'europe']
    },
    'sum_usd' : {
        name: 'Вартість послуг AW в доларах',
        types: ['america', 'europe']
    },
    'sum_uah' : {
        name: 'вартість послуг AW в гривнях в дужках словами',
        types: ['america', 'europe']
    },
    'date_rod' : {
        name: 'Дата в родовому відмінку місяць - словами',
        types: ['america', 'europe']
    },
    'avans' : {
        name: 'Аванс для договору ЄВРОПА',
        types: ['america', 'europe']
    },
    'ostatok' : {
        name: 'Залишок до сплати для договору ЄВРОПА',
        types: ['america', 'europe']
    }
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
    const [selectedDocument, setSelectedDocument] = useState(Object.keys(documentTypes)[0]);

    const handleChangeDocument = (event) => {
        setSelectedDocument(event.target.value);
    };

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

                saveAs(updatedBlob, `ДОГОВІР_${documentTypes[selectedDocument]}_${data.nomer_dogovora}_${data.FIO.replace(" ", "_")}.docx`);
            } catch (error) {
                console.error('Error processing DOCX:', error);
            }
        };

        reader.readAsArrayBuffer(file);
    };

  return (
      <>
          <label htmlFor="dropdown">Вибери договір:</label>
          <select id="dropdown" value={selectedDocument} onChange={handleChangeDocument}>
              {Object.keys(documentTypes).map((key) => {
                    return (
                        <option key={key} value={key}>{documentTypes[key]}</option>
                    )
              })}
          </select>
          {Object.keys(data)
              .filter((key) => titles[key].types.includes(selectedDocument))
              .map((key) => {
                  return (
                      <div key={key} style={{display: 'flex', justifyContent: 'flex-start', marginTop: 12}}>
                          <label style={{width: 350}}>{titles[key].name}</label>
                          <input style={{width: 900}} type="text" value={data[key]} onChange={(e) => {
                              setData({...data, [key]: e.target.value})
                          }}/>
                      </div>
                  )
              })}
          <button style={{marginTop: 12}} onClick={() => {
              setData({...init})
          }}>Очистити
          </button>
          <input
              onClick={(e) => {
                  e.target.value = null;
              }} type="file" id="actual-btn" style={{marginTop: 12, marginLeft: 12}} onChange={handleFileUpload}/>
      </>
  )
}

export default App
