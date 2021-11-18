let cardId = document.querySelectorAll('.card-img');

cardId.forEach(element => {
    element.addEventListener('click' , () => {
        console.log('salom');
        let id = $(element).attr("dataId")
        console.log(id);
        window.location.href = id
    })
})