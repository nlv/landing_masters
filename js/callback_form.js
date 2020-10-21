const CallbackForm =  () => { 

    const refName = React.useRef('')
    const refPhone = React.useRef('')

    const isMounted = React.useRef(true)

    const stateConsts = {
        normal:  1,
        sending: 2,
        failed:  3,
        empty:   4,
        success: 5
    }

    const [state, setState] = React.useState(stateConsts.normal)      
    const [isEmpty, setEmpty] = React.useState(true)
    
    const sendForm = React.useCallback(async () => {
        
        if (state == stateConsts.sending) return
        if (isEmpty) {
          setState(stateConsts.empty)
          return
        }
        setState(stateConsts.sending)
    
        const data = {
            callbackName: refName.current.value,
            callbackPhone: refPhone.current.value
        }

        axios.post('http://78.40.219.246:8080/api/callback', data, {}).then((a) =>  {
          setState(stateConsts.success)
          refName.current.value = ''
          refPhone.current.value = ''
          setEmpty(true)
        }).catch ((error) => {
          if (isMounted.current) {
            setState(stateConsts.failed)
            console.log(error)
          }
        })

    })

    return (
        <div>
            <input ref={refName} type="text" className="form-control" id="firstname" placeholder="Имя"
                onChange={(event) => {
                  setEmpty (event.target.value.length == 0 && refPhone.current.value.length == 0)
                  setState(stateConsts.normal)
                  }}/>
            <input ref={refPhone} type="telephone" className="form-control" id="phone" placeholder="Номер телефона"
                onChange={(event) => {
                  setEmpty (event.target.value.length == 0 && refPhone.current.value.length == 0)
                  setState(stateConsts.normal)
                  }}/>
            <div className="col-md-offset-6 col-md-6 col-sm-offset-1 col-sm-10">
                <input name="submit" type="button" className="form-control" id="submit" value="ПЕРЕЗВОНИТЕ МНЕ" 
                // disabled={state != stateConsts.normal && state != stateConsts.failed} onClick={sendForm}/>
                disabled={state == stateConsts.empty || state == stateConsts.sending} onClick={sendForm}/>

            </div>
            {
                state == stateConsts.success && 
                <div className="wow fadeInUp col-md-12 col-sm-12" data-wow-delay="0.3s"><h3>Заявка отправлена!</h3></div>
            }            
            {
                state == stateConsts.empty && 
                <div className="wow fadeInUp col-md-12 col-sm-12" data-wow-delay="0.3s"><h3>Перед отправкой заявки заполните поля</h3></div>
            }            
            {
                state == stateConsts.failed && 
                <div className="wow fadeInUp col-md-12 col-sm-12" data-wow-delay="0.3s"><h3>Ошибка отправки заявки. Повторите позже или позвоните сами.</h3></div>
            }
        </div>    
    )
  
  }
  