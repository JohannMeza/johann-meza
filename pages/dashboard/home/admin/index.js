import MainComponent from "../../../../src/components/layout/dashboard/main/MainComponent";
import Controls from "../../../../src/components/Controls";

export default function HomePage() {
  const thead = [ "#", "Last", "first" ]
  const tbody = [
    { 
      value: 1, 
      last: "Vlor", 
      first: "Juan"
    },
    { 
      value: 1, 
      last: "Vlor", 
      first: "Juan"
    },
    { 
      value: 1, 
      last: "Vlor", 
      first: "Juan"
    },
    { 
      value: 1, 
      last: "Vlor", 
      first: "Juan"
    },
  ]

  
  return (
    <MainComponent>
      <div className='columns-2'>
        <Controls.CardComponent title={"Publicaciones"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" />
            <Controls.ButtonComponent title="Excel" className="color-secondary" />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>{thead.map((row, index) => <th key={index}>{row}</th>)}</tr>
              </thead>
              <tbody>
                {tbody.map((row, index) => 
                  <tr key={index}>
                    <td>{row.value}</td>
                    <td>{row.last}</td>
                    <td>{row.first}</td>
                  </tr>)
                }
              </tbody>
            </Controls.TableComponent>
          </div>
        </Controls.CardComponent>

        <Controls.CardComponent title={"Visualizaciones"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" />
            <Controls.ButtonComponent title="Excel" className="color-secondary" />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>{thead.map((row, index) => <th key={index}>{row}</th>)}</tr>
              </thead>
              <tbody>
                {tbody.map((row, index) => 
                  <tr key={index}>
                    <td>{row.value}</td>
                    <td>{row.last}</td>
                    <td>{row.first}</td>
                  </tr>)
                }
              </tbody>
            </Controls.TableComponent>
          </div>
        </Controls.CardComponent>
      </div>

      <div className='columns-1 margin-base-top-card'>
        <Controls.CardComponent title={"Comentarios"}>
          <div className='flex gap-2'>
            <Controls.ButtonComponent title="Nuevo" className="color-secondary" />
            <Controls.ButtonComponent title="Excel" className="color-secondary" />
          </div>
          <div>
            <Controls.TableComponent>
              <thead>
                <tr>{thead.map((row, index) => <th key={index}>{row}</th>)}</tr>
              </thead>
              <tbody>
                {tbody.map((row, index) => 
                  <tr key={index}>
                    <td>{row.value}</td>
                    <td>{row.last}</td>
                    <td>{row.first}</td>
                  </tr>)
                }
              </tbody>
            </Controls.TableComponent>
          </div>
        </Controls.CardComponent>
      </div>
    </MainComponent>
  )
}