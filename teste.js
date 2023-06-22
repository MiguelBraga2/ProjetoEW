const processIds = [1, 2, 3, 4, 5];
const baseUrl = 'https://api.example.com/processes';

// Construir a URL da API com os parâmetros da query string
const queryParams = `ids=${processIds.join(',')}`;
const url = `${baseUrl}?${queryParams}`;

console.log(url)