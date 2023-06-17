
document.getElementById('searchLivre').addEventListener('input', search);
document.getElementById('searchProcesso').addEventListener('input', search);
document.getElementById('searchRelator').addEventListener('input', search);
document.getElementById('searchDescritores').addEventListener('input', search);


function truncateText(text, maxLength) {
    if (text) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    } else {
        return 'N/A'
    }
}



// Fazer uma solicitação ao servidor
function solicitation(str, page, limit) {
    fetch(str+'&page='+page+'&limit='+limit)
        .then(response => response.json())
        .then(data => {
            // Limpar a lista de resultados
            const resultsList = document.getElementById('resultsList');
            resultsList.innerHTML = '';

            data.results.forEach(result => {
                // Criar o HTML para cada resultado
                const listItemHTML = `<li class="list-group-item">
                <div class="card mb -2"> <div class="card-body">
                <h5 class="text-start text-primary"><a href="/acordaos/${result._id}">${result.Processo || 'N/A'}</a></h1>
                <div class="row pb-2">
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Tribunal:</b> ${result.Tribunal || 'N/A'}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Relator:</b> ${result.Relator || 'N/A'}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Data do Acordão:</b> ${result['Data do Acordão'] || 'N/A'}</div>
                    </div>
                </div>
                <div class="text-start pb-2"> <b>Área Temática:</b> ${result['Área Temática'] || 'N/A'}</div>
                <div class="text-start pb-2"> <b>Descritores:</b> ${result['Descritores'] || 'N/A'}</div>
                <div class="text-start pb-2">
                    <b>Sumário:</b> ${truncateText(result['Sumário'], 500) || 'N/A'}
                    <!-- Button trigger modal -->
                    <a href="#" class="p-1 rounded" data-bs-toggle="modal" data-bs-target="#staticBackdrop${result._id}">    Ver mais </a>
                    <div class="modal fade" id="staticBackdrop${result._id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel"><a href="/acordaos/${result._id}">${result.Processo || 'N/A'}</a>- Sumário</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            ${result['Sumário'] || 'N/A'}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                </div></li>`;

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

document.getElementById('previous').addEventListener('click', (e) => {
    var str = url

    l = document.getElementById('searchLivre').value;
    if (l !== '') {
      str += '&livre=' + l; 
    }
    p = document.getElementById('searchProcesso').value;
    if (p !== '') {
        str += '&processo=' + p; 
    }
    r = document.getElementById('searchRelator').value;
    if (r !== '') {
        str += '&relator=' + r; 
    }
    d = document.getElementById('searchDescritores').value;
    if (d !== '') {
        str += '&descritor=' + d; 
    }

    solicitation(str,e.target.getAttribute('page'),e.target.getAttribute('limit'))
});

document.getElementById('next').addEventListener('click', (e) => {
    var str = url
    l = document.getElementById('searchLivre').value;
    if (l !== '') {
      str += '&livre=' + l; 
    }
    p = document.getElementById('searchProcesso').value;
    if (p !== '') {
        str += '&processo=' + p; 
    }
    r = document.getElementById('searchRelator').value;
    if (r !== '') {
        str += '&relator=' + r; 
    }
    d = document.getElementById('searchDescritores').value;
    if (d !== '') {
        str += '&descritor=' + d; 
    }

    solicitation(str,e.target.getAttribute('page'),e.target.getAttribute('limit'))
});



function search() {
    var str = url
    
    l = document.getElementById('searchLivre').value;
    if (l !== '') {
      str += '&livre=' + l; 
    }
    p = document.getElementById('searchProcesso').value;
    if (p !== '') {
        str += '&processo=' + p; 
    }
    r = document.getElementById('searchRelator').value;
    if (r !== '') {
        str += '&relator=' + r; 
    }
    d = document.getElementById('searchDescritores').value;
    if (d !== '') {
        str += '&descritor=' + d; 
    }

    solicitation(str,'1','15');
}

solicitation(url,'1','15')