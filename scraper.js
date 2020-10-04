const axios = require("axios");
const cheerio = require("cheerio");

const nlp = require("./nlp");

// const getProjects = async (tags) => {
    
// let url = "https://devpost.com/software/search?query=";
//   try {
//     //query example = smart fridge mirror sensor raspberry pi => smart+fridge+mirror
//     let query = tags.split(" ").join("+");
//     const { data } = await axios.get(url + query);
//     const $ = cheerio.load(data);

//     // $('div.gallery-item figcaption .software-entry-name > h5').each((_idx, el) => {
//     // 	const projectTitle = $(el).text()
//     // 	projectTitles.push(projectTitle)
//     // });

//     let lastPage = $("ul.pagination li").last().prev().text();

//     let pages = [];
//     for (let i = 1; i <= parseInt(lastPage); i++) {
//       pages.push(axios.get(url + query + `&page=${i}`).then((res) => res.data));
//     }

//     const projectTitles = [];

//     await Promise.all(pages).then((res) => {
//       let links = [];
//       res.forEach((data) => {
//         const c = cheerio.load(data);
//         c("div.gallery-item figcaption .software-entry-name > h5").each(
//           (_idx, el) => {
//             const projectTitle = c(el).text();
//             projectTitles.push(projectTitle);
//           }
//         );

//         let link = c("div.gallery-item > a.link-to-software").attr("href");
//         links.push(link);
//       });

//       let projectPromises = links.map((link) => {
//         return axios.get(link).then((res) => res.data);
//       });
//       Promise.all(projectPromises)
//         .then((projects) => {
//           projects.forEach((data) => {
//             //NLP stuff here ?
//             let c2 = cheerio.load(data);
//             // console.log(data);
//             let projectDescriptions = c2(
//               "#app-details-left > div + div p"
//             ).text();
//             console.log(projectDescriptions);
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//     return projectTitles;
//   } catch (error) {
//     throw error;
//   }
// };

const searchProjectNames = async (hackathonName) => {
  let url = `https://devpost.com/hackathons?&search=${hackathonName}&challenge_type=all&sort_by=Recently+Added`;

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  let rows = $("div.results .row");
  let projects = [];
  rows.each((index, el) => {
    let title = $(el).find("h2.title").text();
    let url = $(el).find("a.clearfix").attr("href");
    projects.push({
      title,
      url,
    });
  });

  return projects;
};

const generateHackathonReport = async (hackathonUrl) => {
  try {
    // url format = https://shellmakeathon.devpost.com/?ref_content=default&ref_feature=challenge&ref_medium=discover
    let regex = /https:\/\/.+.devpost.com/;
    let match = hackathonUrl.match(regex);

    //parse into just url = https://shellmakeathon.devpost.com/
    let url = match[0] + "/project-gallery";

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    let pagination = $("ul.pagination");

    let pages = [];
    //if there is pagination on the page, promise All
    if (pagination.length > 0) {
      const lastPage = pagination.find("li").last().prev().text();

      for (let i = 1; i <= parseInt(lastPage); i++) {
        pages.push(axios.get(url + `?page=${i}`).then((res) => res.data));
      }
    }
    //only one page of submissions
    else {
      pages.push(axios.get(url).then((res) => res.data));
    }

    let reports = await Promise.all(pages).then(async(page) => {
        let reports = [];
        for(let i = 0; i < page.length; i++) {
            let data = page[i];
            let $ = cheerio.load(data);

            let promises = [];
            let info = [];
            $("div.gallery-item").each((index, elem) => {

                let projectTitle = $(elem).find("figcaption .software-entry-name > h5").text();
                let projectLink = $(elem).find("a.link-to-software").attr("href");
                let projectThumbnail = $(elem).find("img.software_thumbnail_image").attr("href");
                
                //for each gallery item analyze a project
                // let report = await analyzeProject(projectLink);
                promises.push(analyzeProject(projectLink));
                info.push({
                    title: projectTitle,
                    link: projectLink,
                    thumbnail: projectThumbnail,
                    // contributors: report.contributors, //inlcude name and link
                    // similarProjects: report.similarProjects,
                    // description: report.description,
                });
            });
            let promisedReports = await Promise.all(promises);
            reports = promisedReports.map((r, index) => {
                return {
                    title: info[index].projectTitle,
                    link: info[index].projectLink,
                    thumbnail: info[index].projectThumbnail,
                    contributors: r.contributors, //inlcude name and link
                    similarProjects: r.similarProjects,
                    description: r.description,
                }
            })
        }
        console.log('all reports', reports);
        return reports;
      })
      .catch((err) => {
        console.log(err);
      });

    return reports;

  } catch (err) {
    console.log("error", err);
  }
};

async function analyzeProject(url) {
    try {
        console.log('analyzing...')
        const { data } = await axios.get(url);

        let $ = cheerio.load(data);
      
        let originalDescription = $("#app-details-left > div + div p").text();

        let contributorLinks = [];
        $("#app-team ul > li .row figure > a.user-profile-link").map((index, elem) => {
            contributorLinks.push($(elem).attr('href'));
        });
            
        let contributorPages = contributorLinks.map(link => axios.get(link).then(res => res.data));
        
        let similarProjects = await Promise.all(contributorPages).then(async contributor => {
            let similarProjects = [];
            contributor.forEach(async (data, dataIndex) => {
                const $ = cheerio.load(data);

                let pagination = $("ul.pagination");
                
                let pages = [];
                let pageUrl = contributorLinks[dataIndex];
                //if there is pagination on the page, promise All
                if (pagination.length > 0) {
                    const lastPage = pagination.find("li").last().prev().text();
            
                    for (let i = 1; i <= parseInt(lastPage); i++) {
                    pages.push(axios.get(pageUrl + `?page=${i}`).then((res) => res.data));
                    }
                }
                //only one page of submissions
                else {
                    pages.push(axios.get(pageUrl).then((res) => res.data));
                }

                let similarContributorProjects = await analyzeContributorProjects(pages, originalDescription, pageUrl, url);
               
                similarProjects = [...similarProjects, ...similarContributorProjects];
                
            })
            return similarProjects;

        })
        .catch(err => {
            console.log(err);
        })

        let contributors = contributorLinks.map(link => {    
            const paths = link.split("/");
            let contributorName = paths[paths.length - 1];
            return contributorName;
        })

        return {
            similarProjects: similarProjects,
            contributors: contributors,
            description: originalDescription
        };
    }
    catch (err) {
        console.log(err);
    }
 
}

async function analyzeContributorProjects(pages, originalDescription, contributorLink, originalProjectLink) {
    try {
        console.log('...analyzing contributors');
        const paths = contributorLink.split("/");
        let contributorName = paths[paths.length - 1];

        let similarProjects = await Promise.all(pages).then(async page => {
            let analyzedProjects = [];

            //Each page of contributor projects
            for(let i = 0; i < page.length; i++) {
                let data = page[i];
                let $ = cheerio.load(data);
                
                let nestedPromises = [];
                let info = [];
                //Go through all project cards
                $("div.gallery-item").each(async (index, elem) => {

                  let projectTitle = $(elem)
                    .find("figcaption .software-entry-name > h5")
                    .text();

                  let projectLink = $(elem).find("a.link-to-software").attr("href");

                  let projectThumbnail = $(elem)
                    .find("img.software_thumbnail_image")
                    .attr("href");
                
                    // console.log(projectLink, originalProjectLink);
                    if(projectLink != originalProjectLink) {   
                    
                        //for each gallery item analyze the contributor project and compare similarity
                        // let nestedProjectLink = axios.get(projectLink).then(res => res.data);
                        nestedPromises.push(axios.get(projectLink).then(res => res.data));
                        
                        info.push({
                            title: projectTitle,
                            contributor: {
                                name: contributorName,
                                link: contributorLink
                            },
                            thumbnail: projectThumbnail,
                            projectLink: projectLink,
                        })
                        
                    }
                  
                });
                
                let similarities = await Promise.all(nestedPromises).then(async page => {
                    let $ = cheerio.load(page);

                    let pastProjectDescription = $("#app-details-left > div p").text();
                    
                    let similarity = await nlp.compareDescriptionSimilarity(originalDescription, pastProjectDescription);
                    
                    return similarity;
                })
                if(similarity > 0.5) {
                    console.log('similar', similarity)
                    analyzedProjects.push({
                        title: projectTitle,
                        contributor: {
                            name: contributorName,
                            link: contributorLink
                        },
                        thumbnail: projectThumbnail,
                        projectLink: projectLink,
                        similarity: similarity
                    });
                }
            }
            return analyzedProjects;
        })

        return similarProjects;
    }
    catch(err) {
        console.log(err);
    }
}


module.exports = {
  searchProjectNames,
  generateHackathonReport,
  analyzeProject
};
