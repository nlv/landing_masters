const CallbackForm =  () => { 

    const refName = React.useRef('')
    const refPhone = React.useRef('')

    const isMounted = React.useRef(true)

    const stateConsts = {
        normal:  1,
        sending: 2,
        failed:  3,
      }

    const [state, setState] = React.useState(stateConsts.normal)      
    const [phone, setPhone] = React.useState('')      

    const sendForm = React.useCallback(async () => {
        
        if (state == stateConsts.sending) return
        setState(stateConsts.sending)
    
        const data = {
            callbackName: refName.current.value,
            callbackPhone: refPhone.current.value
        }
    
        axios.post('http://78.40.219.246:8080/api/callback', data, {}).then((a) =>  {
          setState(stateConsts.normal)
        }).catch ((error) => {
          if (isMounted.current) {
            setState(stateConsts.failed)
            console.log(error)
          }
        })

    })

    return (
        <div>
            <input ref={refName} type="text" className="form-control" id="firstname" placeholder="Имя"/>
            <input ref={refPhone} type="telephone" className="form-control" id="phone" placeholder="Номер телефона"
            onChange={(event) => setPhone(event.target.value)}/>
            <div className="col-md-offset-6 col-md-6 col-sm-offset-1 col-sm-10">
                <input name="submit" type="button" className="form-control" id="submit" value="ПЕРЕЗВОНИТЕ МНЕ" 
                disabled={phone.length == 0 ||state == stateConsts.sending} onClick={sendForm}/>
            </div>
            {
                state == stateConsts.failed && 
                <div className="wow fadeInUp col-md-12 col-sm-12" data-wow-delay="0.3s"><h3>Ошибка отправки. Повторите позже или позвоните сами.</h3></div>
            }
        </div>    
    )
  
  }
  