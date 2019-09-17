import React, {useState} from 'react';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import AppDialog from '../../../components/AppDialog/AppDialog';

import { ADD_TRANSACTION, DELETE_TRANSACTION, UPDATE_TRANSACTION } from '../../../store/reducers/transactionsReducer';
import { format } from 'date-fns'
import * as uniqid from 'uniqid';
import { compare } from '../../../util';

const TransactionsTable = props => {

    const { 
        filteredTransactions:transactions, 
        addTransaction, deleteTransaction, 
        updateTransaction, 
     } = props;

    const categoriesOpt = {

        income: [
            {label: "Paycheck",         value: "paycheck"},
            {label: "Dividend",         value: "dividend"},
            {label: "Allowance",        value: "allowance"},
            {label: "Bonus",            value: "bonus"},
            {label: "Other",            value: "other"}
        ],
        expense: [

            {label: "Food",             value: "food"},
            {label: "Social Life",      value: "social-life"},
            {label: "Transportation",   value: "transportation"},
            {label: "Beauty",           value: "beauty"},
            {label: "Health",           value: "health"},
            {label: "Education",        value: "education"},
            {label: "Gift",             value: "gift"},
            {label: "Household",        value: "household"},
            {label: "Insurance",        value: "insurance"},
            {label: "Tax",              value: "tax"},
            {label: "Other",            value: "other"},
        
        ]
    
    }

    const typeOpt = [
        {label: "Expense", value: "expense"},
        {label: "Income", value: "income"}
    ]

    //STATE ----------------------------------------------------------------------------------

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState(categoriesOpt.expense[0].value);
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState(0);

    const [dialogShow, setDialogShow] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    //END STATE -------------------------------------------------------------------------------

    //FUNCTIONS -------------------------------------------------------------------------------

    function handleAddTransaction(){
        const transaction ={
            id: uniqid(),
            type,
            date,
            category,
            notes,
            amount
        }
        reset();
        addTransaction(transaction);
    }
    
    function handleDeleteClick(transactionId){
        setTransactionId(transactionId);
        setDialogShow(true);
    }

    function handleDeleteTransaction(){
        setDialogShow(false);
        deleteTransaction(transactionId);
    }

    function handleUpdateTransaction(transaction){
        updateTransaction(transaction);
    }

    function reset(){
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setType('expense');
        setCategory(categoriesOpt[type][0].value);
        setNotes("");
        setAmount(0);
    }

    

    //END FUNCTIONS ----------------------------------------------------------------------------

    return ( 
        <React.Fragment>

            <div className="transactions-table card">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Notes</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="row-add">
                                            <td>
                                                <input 
                                                type="date" 
                                                value={date} 
                                                onChange={e => setDate(e.target.value)}/>
                                            </td>
                                            <td>
                                                <select 
                                                    onChange={e => setType(e.target.value)} 
                                                    className="select-type"
                                                    value={type}>
                                                    {typeOpt.map(t => (
                                                        <option key={t.value} value={t.value}>{t.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select 
                                                onChange={e => setCategory(e.target.value)} 
                                                className="select-category"
                                                value={category}>
                                                    {categoriesOpt[type].sort((a,b) => compare(a,b)).map(cat =>(
                                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                    ))}
                                                </select>
                                                </td>
                                            <td><textarea 
                                                rows="1" 
                                                className="textarea-notes"
                                                onChange={e => setNotes(e.target.value)}  
                                                value={notes}></textarea></td>
                                            <td><input type="number" value={amount} className="input-amount" onChange={e => setAmount(e.target.value > 0? e.target.value: 0)}/></td>
                                            <td className="text-center"><button className="btn btn-primary" onClick={handleAddTransaction} disabled={(date === "" || amount === 0)}>Add</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    <tr>
                        <td>
                            <div className="table-content">
                                <table className="table table-hover ">
                                    <tbody>
                                        {transactions.map(
                                            transaction => {
                                                return (
                                                <TransactionRow 
                                                    key={transaction.id}
                                                    transaction={transaction}
                                                    onUpdateTransaction={handleUpdateTransaction}
                                                    onDeleteClick={handleDeleteClick}
                                                    onDeleteTransaction={handleDeleteTransaction}
                                                    categoriesOpt={categoriesOpt}
                                                    typeOpt={typeOpt}
                                                    />
                                                )
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <AppDialog 
                title={'Remove Transaction'}
                message={`Do you want to remove this transaction?`}
                show={dialogShow}
                onClose={() => setDialogShow(false)}
                onConfirm={handleDeleteTransaction}                    
          />
        </React.Fragment>
     );
}

const mapStateToProps = state => {
    return {
        filteredTransactions: state.transactions.filteredTransactions,
        date: state.dateSlider.date
    }
}

const mapDispatchToProps = dispatch => {
    return {

        addTransaction: transaction => {
            const action ={
                type: ADD_TRANSACTION,
                transaction
            } 
            dispatch(action)
        },

        deleteTransaction: transactionId => {
            const action ={
                type: DELETE_TRANSACTION,
                transactionId
            } 
            dispatch(action)
        },

        updateTransaction: transaction => {
            const action ={
                type: UPDATE_TRANSACTION,
                transaction
            } 
            dispatch(action)
        },
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(TransactionsTable);