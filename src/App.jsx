import { useEffect, useState } from "react";
import api from './api/cars';
function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: 1,
    maker: '',
    model: '',
    year: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await api.get('/cars');
        setData(response.data);
      } catch(error) {
        console.error(error);
      }
    }
    fetchData();
  },[formData])

  const handleFormSubmit = async(event) => {
    event.preventDefault();
  
    const response = await api.get('/cars');
    
      const maxId = Math.max(...response.data.map(car => car.id));
    
      formData.id = maxId + 1;
    
      try {
        const postResponse = await api.post('/cars', formData);
    
        setFormData((prevFormData) => ({
          id: prevFormData.id + 1,
          maker: "",
          model: "",
          year: "",
        }));
      } catch(error) {
        console.error(error);
      }
  } 

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  }

  const handleDelete = async(id) => {
    try{
      await api.delete(`/cars/${id}`);

      setData((prevData) => prevData.filter((car) => car.id !== id));

      const maxİd = data.reduce((max,car) => (car.id > max ? car.id : max),0);
      const newId = maxİd + 1;

      setFormData((prevFormData) => ({
        ...prevFormData,
        id: newId
      }))
    } catch(error){
      console.error(error)
    }
  }

  return (
    <>
      <div className="App">
        <h1>Car Management system</h1>
        <form onSubmit={handleFormSubmit}>
          <h3>Add New Car</h3>
          <input 
            type="text" 
            placeholder="Maker"
            name="maker"
            value={formData.maker}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <input 
            type="text" 
            placeholder="Model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            autoComplete="off" 
          />
          <input 
            type="text" 
            placeholder="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            autoComplete="off"      
          />
          <button type="submit">Submit</button>
        </form>

        <ul>
          {data.map((item) => {
            return(
              <li key={item.id}>
                {item.maker} {item.model} ({item.year})
                <div>
                <button className="editButton" onClick={() => handleEdit(item.id)}>Edit</button>
                <button className="deleteButton" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </li>
          )})}
        </ul>
      </div>
    </>
  )
}

export default App
