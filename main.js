//Color set
colors = {
    light:{
        Base:'hsl(0, 0%, 100%)',
        Background:'hsl(0, 0%, 98%)',
        TextCol:'hsl(200, 15%, 8%)',
        Input:'hsl(0, 0%, 52%)'
    },
    dark:{
        Base:'hsl(209, 23%, 22%)',
        Background:'hsl(207, 26%, 17%)',
        TextCol:'hsl(0, 0%, 100%)',
        Input:''
    },
}

//Base Variables
const TemplateCountry = document.getElementById('Template-Country')
const MainFrame = document.getElementById('Main-Frame')
//Country display
const CountryFrame = document.getElementById('Country-Frame')
const CF_Flag = document.getElementById('Country-Flag')
const CF_Name = document.getElementById('Country-Name')
const CF_NativeName = document.getElementById('Country-Native-Name')
const CF_Population = document.getElementById('Country-Population')
const CF_Region = document.getElementById('Country-Region')
const CF_SubRegion = document.getElementById('Country-Sub-Region')
const CF_Capital = document.getElementById('Country-Capital')
const CF_Domain = document.getElementById('Country-Domain')
const CF_Currencies = document.getElementById('Country-Currencies')
const CF_Languages = document.getElementById('Country-Languages')
const CF_BorderCountries = document.getElementById('Border-List')
const CF_BorderTemp = document.getElementById('Border-Country-Temp')
//other stuff
const Search = document.getElementById('Search-Frame')
const DropDownB = document.getElementById('Drop-Down-Button')
const DropDownM = document.getElementById('Drop-Down-Menu')
const DropDownRegions = document.querySelectorAll('.Region-Select')

const Back = document.getElementById('Back')
Back.addEventListener('click',(e) => {
    CountryFrame.style.display='none'
    MainFrame.style.display='flex'
    Search.style.display='flex'
})

let CountryID = 0
let Countries = [] //Format: (key)ShortenedName : FullName(value)

//Function to get country by tag
function GetTag(nam, req) {
    if (req==='GetFullName') {
        return Countries[nam] //Returns normal tag
    } else if (req==='GetShortened'){
        return Countries.indexOf(Countries[i]) //Returns the index 
    }
    return null
}

//Function to create the country based on CountryData
function CreateCountry(CountryData){
    //Set data variables
    const Capital = CountryData.capital
    const Region = CountryData.region
    const Population = CountryData.population
    const Flag = CountryData.flags.svg
    const Name = CountryData.name.official
    const SubRegion = CountryData.subregion
    const Languages = CountryData.languages
    const Domain = CountryData.tld
    const Currencies = CountryData.currencies
    const CountryTag = CountryData.cca3
    const NativeName = CountryData.name.nativeName
    const Borders = CountryData.borders
    
    //Set new template
    let NewCountry = TemplateCountry.cloneNode(true)
    let CountryFlag = NewCountry.querySelector(".flag")
    let CountryInfo = NewCountry.querySelector(".Country-Info")
    let CountryPopulation = CountryInfo.querySelector('.Population')
    let CountryRegion = CountryInfo.querySelector('.Region')
    let CountryName = CountryInfo.querySelector('.country-name')
    let CountryCapital = CountryInfo.querySelector('.Capital')

    //Update NewCountry
    NewCountry.style.display='flex'
    NewCountry.id = CountryID
    NewCountry.className='Country'
    NewCountry.countrytag = CountryTag

    //Update Info & Flag
    CountryFlag.src = Flag
    CountryName.innerText = Name
    CountryRegion.innerHTML = '<span>Region: </span>'+Region
    CountryPopulation.innerHTML = '<span>Population: </span>'+Population.toLocaleString() //toLocaleString formats the number properly!
    CountryCapital.innerHTML = '<span>Capital: </span>'+Capital
    //Update values
    NewCountry.region = Region
    NewCountry.CountryName = Name

    //Set the parent
    MainFrame.appendChild(NewCountry)

    //Push the shortened & full name to countrylist
    Countries[CountryTag] = Name

    //Setting up functions on click and stuff yeah
    CountryFlag.addEventListener('click', (e) => {
        //Set the display of all the frames
        MainFrame.style.display = 'none'
        Search.style.display = 'none'
        CountryFrame.style.display = 'flex'
        //Object keys, values & combined to right "format"
        let Langs = Object.values(Languages) 
        let Currs = Object.keys(Currencies)
        let Currs2 = Object.values(Currencies)
        let Currs3 = [] 

        for (i=0;i<Currs.length;i++) {//Format loop
            let STR = Currs[i]+' ['+Currs2[i].symbol+'] ('+Currs2[i].name+')'//This formats the string properly (imo)
            Currs3.push(STR)//Yay, push it to the array!
        }
        //Set up the country full page
        CF_Flag.src = Flag
        CF_Capital.innerHTML = '<span>Capital: </span>'+Capital
        CF_Name.innerText = Name
        CF_Population.innerHTML = '<span>Population: </span>'+Population.toLocaleString()
        CF_Region.innerHTML = '<span>Region: </span>'+Region
        CF_SubRegion.innerHTML = '<span>Sub Region: </span>'+SubRegion
        CF_Languages.innerHTML = '<span>Languages: </span>'+Langs.join(', ')
        CF_Domain.innerHTML = '<span>Top Level Domain: </span>'+Domain
        CF_Currencies.innerHTML = '<span>Currencies: </span>'+Currs3.join(', ')
        CF_NativeName.innerHTML = '<span>Native Names: </span>'+NativeName

        const xd = CF_BorderCountries.getElementsByClassName('Border-Country')

        for (i=0;i<xd.length;i++){//This was a sad attempt at making the border countries work
            xd[i].remove()
        }
        if (Borders !== undefined) { //sum tins wong
            CF_BorderTemp.style.display='none'
            for (i=0;i<Borders.length;i++){
                let NewTemp = CF_BorderTemp.cloneNode()
                NewTemp.className = 'Border-Country'
                NewTemp.style.display='initial'
                NewTemp.innerText = Borders[i]
                CF_BorderCountries.appendChild(NewTemp)
            }
        } else if (Borders === undefined){
            CF_BorderTemp.style.display='initial'
        }
    })
}

//Acquiring the Country Data
fetch('https://restcountries.com/v3.1/all') //Fetch from the url
.then(data=>{ //Check Data & Return as json
    if (!data.ok) {
        throw Error(data.status)
    }
    return data.json()
}).then(NewData => { //NewData is all of our info
    NewData.forEach(e => {
        CountryID += 1
        console.log(e)
        CreateCountry(e)
    })
})

//Dropdown

DropDownB.addEventListener('click', (e) => {
    if (DropDownM.style.display !== 'flex') {
        DropDownM.style.display = 'flex'
    } else if (DropDownM.style.display === 'flex') {
        DropDownM.style.display = 'none'
    }
})

function ShowRegion(Reg){ //We display all the ones with that region
    const Countries = document.getElementsByClassName('Country')
    for (i=0;i<Countries.length;i++){
        if (Reg === 'All') {
            Countries[i].style.display = 'flex'
        } else if (Reg !== 'All') {
            const CountryReg = Countries[i].region
            if (CountryReg === Reg) {
                Countries[i].style.display = 'flex'
            } else if (CountryReg !== Reg) {
                Countries[i].style.display = "none"
            }
        }
    }
}

for (i=0;i<DropDownRegions.length;i++) {   
}[].forEach.call(DropDownRegions, function(Obj) { //Huh?
    Obj.addEventListener('click', (e) => {
        DropDownM.style.display = 'none'
        const GetRegion = Obj.getAttribute('value')
        ShowRegion(GetRegion)
    })
})