import { useMsal } from "@azure/msal-react";
import { useEffect, useRef, useState } from "react";
import { RiseLoader } from "react-spinners";
import { Employee } from "../dtos";
import './homepage.css';
import { override } from "./login/login";


export default function HomePage() {
    const client = useMsal();
    const account = client.accounts[0];
    const [switchCreate, setSwitch] = useState(false);
    const [employees, setEmployees] = useState([]);

    function logout() {
        client.instance.logout();
    }

    return (<div className='totalEmp'>
        <h1 className='empHeaderLabel'>Welcome Tech Adming: {account.username} </h1>
        <button onClick={logout} className="Btn">LOG-OUT</button>
        <div className='containerEmp'>
            <button onClick={() => { setSwitch(true) }} className='pastBtn'>Create User</button>
            <button onClick={() => { setSwitch(false) }} className='newBtn'>All Users</button>
            <div className='containerEmpShow'>
                <>{
                    switchCreate ? <CreateUser /> : <AllUsers employees={employees} setEmployee={setEmployees} />
                }</>
            </div>
        </div>
    </div>);
}

export function AllUsers(props: { employees: Employee[], setEmployee: Function }) {
    const [loading, setLoading] = useState(false);
    const { setEmployee } = props;
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await fetch(`http://20.121.74.219:3000/employees`);
            const employ: Employee[] = await response.json();
            if (response.status === 200) {
                let emp: Employee[] = [];
                let man: Employee[] = [];
                for (const c of employ) {
                    if (c.isManager) {
                        man.push(c);
                    } else {
                        emp.push(c);
                    }
                }
                setEmployee(employ);
                setEmployees(emp);
                setManagers(man);
                // console.log(props.employees);
                setLoading(false);
            } else {
                console.log("ERROR");
            }
        })();
    }, [setEmployee]);

    const emptableRows = employees.map(r => <EmployeeRow key={r.id} {...r} />);
    const mantableRows = managers.map(r => <EmployeeRow key={r.id} {...r} />);

    if (loading) {
        return (<div className="loaderDefaultDiv"><RiseLoader css={override} color="white" size={50} /></div>)
    } else {

        return (<>
            {employees.length !== 0 ?
                <>
                    <p className="THH">Employees</p>
                    <table>
                        <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Username</th></tr></thead>
                        <tbody>{emptableRows}</tbody>
                    </table> </> : <h1>No Employees Present!</h1>
            }
            {employees.length !== 0 ?
                <>
                    <p className="THHManager">Managers</p>
                    <table>
                        <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Username</th></tr></thead>
                        <tbody>{mantableRows}</tbody>
                    </table></> : <h1>No Managers Present!</h1>
            }
            <br></br>
        </>);
    }
}

export function EmployeeRow(props: Employee) {
    const { id, fname, lname, username } = props;
    return (<tr>
        <td>
            {id}
        </td>
        <td>
            {fname}
        </td>
        <td>
            {lname}
        </td>
        <td>
            {username}
        </td>
    </tr>)
}

export function CreateUser() {
    const fname = useRef(null);
    const lname = useRef(null);
    const username = useRef(null);
    const password = useRef(null);
    const [isManager, setIsManager] = useState(false);

    const man = "managerCheck";
    const emp = "employeeCheck";


    async function createEmployees() {
        const employeePayload: Employee = {
            isManager: isManager,
            fname: fname.current.value,
            lname: lname.current.value,
            username: username.current.value,
            password: password.current.value
        }
        console.log(`Created Employee: ` + employeePayload);

        if (employeePayload.fname !== '' && employeePayload.lname !== '' && employeePayload.username !== '' && employeePayload.password !== '') {
            const response = await fetch('http://20.121.74.219:3000/employees', {
                method: 'POST',
                body: JSON.stringify(employeePayload),
                headers: {
                    'Content-Type': "application/json"
                }
            });
            await response.json();
            if (response.status === 201) {
                alert('created employee successfully');
            } else {
                alert('Something gone wrong');
            }
        } else {
            alert('Please fill out all the fields');
        }
    }

    return (<>
        <div className="newRemContainer">
            <input ref={fname} type="text" className="fname" placeholder="First Name" />
            <input ref={lname} type="text" className="lname" placeholder="Last Name" />
            <input ref={username} type="text" className="username" placeholder="Username" />
            <input ref={password} type="text" className="password" placeholder="Password" />
            {isManager ?
                <button className={man} onClick={() => setIsManager(false)}>Manager</button> :
                <button className={emp} onClick={() => setIsManager(true)} >Employee</button>
            }
            <button className="submitAccount" onClick={createEmployees}>SUBMIT</button>
        </div>
    </>);
}
