// Fazer uma solicitação ao servidor
function solicitation(str, page, limit) {
    fetch(str+'?page='+page+'&limit='+limit)
        .then(response => response.json())
        .then(data => {
            // Limpar a lista de resultados
            const resultsList = document.getElementById('resultsList');
            resultsList.innerHTML = '';

            data.results.forEach(result => {
                // Criar o HTML para cada resultado
                let listItemHTML = `<li class="list-group-item">
                <div class="card mb -2"> <div class="card-body">
                <div class="row pb-2">
                <div class="col-md-6">
                <h5 class="text-start text-primary"><a href="/users/${result._id}">${result.username || 'N/A'}</a></h1>
                </div>
                <div class="col-md-6">`

                listItemHTML +=`</div></div>
                <div class="row pb-2">
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Username:</b> ${result.username || 'N/A'}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Email:</b> ${result.email || 'N/A'}</div>
                    </div>
                </div>
                `
                if (result.active){
                    listItemHTML += `<div class="text-end h5"><a class="mx-1" href="/users/disable/${result._id}"><i class="fa-solid fa-pause"></i></a>`
                }
                else{
                    listItemHTML += `<div class="text-end h5"><a class="mx-1" href="/users/enable/${result._id}"><i class="fa-solid fa-play"></i></a>`
                }
                listItemHTML +=`
                </div>
                </div>`;

                // Adicionar o HTML à lista de resultados
                resultsList.innerHTML += listItemHTML;
            });


            const previous = document.getElementById('previous');
            
            if (data.previous) {
                previous.classList.remove('disabled');
                previous.setAttribute('page', data.previous.page);
                previous.setAttribute('limit', data.previous.limit);
            } else {
                console.log('No previous')
                previous.classList.add('disabled');
            }
            
            const next = document.getElementById('next');

            if (data.next) {
                next.classList.remove('disabled');
                next.setAttribute('page', data.next.page);
                next.setAttribute('limit', data.next.limit);
            } else {
                next.classList.add('disabled');
            }

        })
        .catch(error => {
            console.error('Erro na pesquisa:', error);
        });
}

solicitation(url,'1','15')