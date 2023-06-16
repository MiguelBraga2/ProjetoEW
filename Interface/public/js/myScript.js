
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
        return 'N/D'
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
                <h5 class="text-start text-primary">${result.Processo}</h1>
                <div class="row pb-2">
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Tribunal:</b> ${result.Tribunal}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Relator:</b> ${result.Relator}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="text-start"> <b>Data do Acordão:</b> ${result['Data do Acordão']}</div>
                    </div>
                </div>
                <div class="text-start pb-2"> <b>Área Temática:</b> ${result['Área Temática']}</div>
                <div class="text-start pb-2"> <b>Descritores:</b> ${result['Descritores']}</div>
                <div class="text-start pb-2">
                    <b>Sumário:</b> ${truncateText(result['Sumário'], 500)}
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