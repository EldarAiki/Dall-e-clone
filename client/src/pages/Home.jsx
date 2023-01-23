import React, { useEffect, useState } from 'react'
import FormField from '../components/FormField'
import Loader from '../components/Loader'
import RenderCards from '../components/RenderCards'
import { URL } from './CreatePost'

const Home = () => {

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState(null)
    const [searchText, setSearchText] = useState(null)
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null)

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const response = await fetch(URL + '/posts',
            { method: 'GET',
            headers: {
            'Content-Type' : 'application/json',
            },       
            })
            if (response.ok) {
               const resault = await response.json() 

               setAllPosts(resault.data.reverse())
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {

        fetchPosts()
    }, [])

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout)
        setSearchText(e.target.value)
        setSearchTimeout(
            setTimeout(() => {
                const searchResault  = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                item.prompt.toLowerCase().includes(searchText.toLowerCase()))
    
                setSearchedResults(searchResault)
            }, 500)
        )
    }
    
     
  return (
    <section className='max-w-7xl mx-auto'>
        <div>
            <h1 className='font-extrabold text-[#222328] text-[32px]'>The Community Showcase</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Browse through a collection of imaginative and visually stunning images generated DALL-E AI</p>
        </div>
        <div className='mt-16'>
            <FormField
                labelName='Search posts'
                type='text'
                name='text'
                placeholder="Search Posts"
                value={searchText}
                handleChange={handleSearchChange}
            />
        </div>
        <div className='mt-10'>
            {loading ? (
                <div className='flex justify-center'>
                    <Loader />
                </div>
            ) : (<>
            {searchText && (
                <h2 className='font-medium text-[#666e75] text-xl mb-3'>Showing resaults for <span className='text-[#222328]'>{searchText}</span></h2>
            )}
             <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3' >
                {searchText ? (
                    <RenderCards data={searchedResults} title='No search resaults found' /> 
                ) : (
                    <RenderCards 
                        data={allPosts}
                        title='No posts found'
                    /> 
                )}
            </div>
            </>)}
        </div>
    </section>
  )
}

export default Home