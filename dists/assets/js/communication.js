// window.communication.listenChange('LOAD-DATA' ,(data) => {console.log(data)}) su dung
window.communication = {
  pushChange: (actionType, data) => {
    document.dispatchEvent(new CustomEvent('vetgo-event-in', { detail: { actionType, data } }));
  },
  listenChange: ( actionType= '' , callBack = (data) => {} ) => {
    document.addEventListener('vetgo-event-out', (event) => {
        if(event.detail.actionType === actionType) {
          callBack(event.detail.data);
        }
    });
  }
}
