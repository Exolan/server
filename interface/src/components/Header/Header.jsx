import { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";

function Header(){
    const dispatch = useDispatch()
    const [tables, setTables] = useState([])
    const [click, isClick] = useState(false)
    const [arrayName, setArrayName] = useState([])
    const [arrayValues, setArrayValues] = useState([])
    // const [arrayInputs, setArrayInputs] = useState([])
    const [clickAdd, setClickAdd] = useState(false)
    const activeOption = useSelector((state) => state.selectedOption)

    let arrayInputs = []
    let table

    useEffect(()=>{
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
    
        async function changeHeader(){
            const array = JSON.parse(await fetch("http://localhost:5000/get/tables", requestOptions)
            .then(response => response.text())
            .then(result => {return result})
            .catch(error => console.log('error', error)));
            
            setTables(array)

            if(click == true){
                for(const index in array){
                    if(index == activeOption){
                        table = Object.values(array[index])[0]
                    }
                }
                const url = `http://localhost:5000/get/${table}`
                const arrayTable = JSON.parse(await fetch(url, requestOptions)
                    .then(response => response.text())
                    .then(result => {return result})
                    .catch(error => console.log('error', error)));
                
                setArrayName(Object.keys(arrayTable[0]).slice(1));
                Object.keys(arrayTable[0]).slice(1).map((key) => {
                    const newObj = {}
                    newObj[key] = null
                    arrayInputs.push(newObj)
                })
                setArrayValues(arrayTable)
                isClick(false)
            }
        }
        changeHeader()
    }, [click])

    useEffect(()=>{
        async function addValues(){
            if(clickAdd == true){
                console.log(arrayInputs);
                setClickAdd(false)
            }
        }
        addValues()
    }, [clickAdd])

    return (
        <div>
            <div>
                <select onChange={(e)=>{dispatch({type: "SET_OPTION", payload: e.target.selectedIndex})}}>
                    {tables.map((value, index)=>{
                        return(
                            <option key={index}>{Object.values(value)[0]}</option>
                        )
                    })}
                </select>
                <button onClick={(e)=>{isClick(true)}}>Показать</button>
            </div>
            <div>
                {arrayName.length != 0 ? 
                    <table>
                        <thead>
                            <tr>
                                {arrayName.map((key, index) => {
                                    return <th key={index}>{key}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {arrayValues.map((obj, index) => {
                                return <tr key={index}>
                                    {Object.values(obj).slice(1).map((value, index) => {
                                        return <th key={index}>{value}</th>
                                    })}
                                </tr>
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                {arrayName.map((index) => {
                                    return <th key={index}><input type="text" onChange={(e) => {arrayInputs[arrayName[index]] = e.target.value}} /></th>
                                })}
                            </tr>
                            <tr>
                                <th>
                                    <button onClick={()=>{setClickAdd(true)}}>Добавить запись</button>
                                </th>
                            </tr>
                        </tfoot>
                    </table> 
                    :null
                }
                
            </div>
        </div>
    )
}

export default Header