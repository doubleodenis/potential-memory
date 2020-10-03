const axios = require('axios');
const cheerio = require('cheerio');

let url = "https://devpost.com/software/search?query="
const getProjects = async (tags) => {
	try {
        //query example = smart fridge mirror sensor raspberry pi => smart+fridge+mirror
        let query = tags.split(" ").join("+");
		const { data } = await axios.get(
			url + query
		);
		const $ = cheerio.load(data);
		
		// $('div.gallery-item figcaption .software-entry-name > h5').each((_idx, el) => {
		// 	const projectTitle = $(el).text()
		// 	projectTitles.push(projectTitle)
		// });

        let lastPage = $('ul.pagination li').last().prev().text();

        let pages = [];
        for(let i = 1; i <= parseInt(lastPage); i++) {
            pages.push(
                axios.get(url + query + `&page=${i}`).then(res => res.data)
            )
        }

        const projectTitles = [];
        
        await Promise.all(pages).then(res => {
            let links = [];
            res.forEach(data => {
                const c = cheerio.load(data);
                c('div.gallery-item figcaption .software-entry-name > h5').each((_idx, el) => {
                    const projectTitle = c(el).text()
                    projectTitles.push(projectTitle)
                });

                let link = c('div.gallery-item > a.link-to-software').attr('href');
                links.push(link);
            })

            let projectPromises = links.map(link => {
                return axios.get(link).then(res => res.data);   
            })
            Promise.all(projectPromises).then(projects => {
                projects.forEach((data) => {
                    //NLP stuff here ?
                    let c2 = cheerio.load(data);
                    // console.log(data);
                    let projectDescriptions = c2('#app-details-left > div + div p').text();
                    console.log(projectDescriptions);
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
		return projectTitles;
	} catch (error) {
		throw error;
	}
};


getProjects("hand size")
.then((projectTitles) => {
    // console.log()
});