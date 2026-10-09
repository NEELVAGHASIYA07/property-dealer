import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Dealer from '#models/dealer'

function formatDealer(dealer: any, fallbackData?: string | null) {
  if (dealer) {
    return {
      id: dealer.id,
      name: dealer.name,
      agencyName: dealer.agencyName,
      company: dealer.agencyName,
      phone: dealer.phone,
      email: dealer.email,
      profilePhoto: dealer.profilePhoto,
      avatar: dealer.profilePhoto,
      officeAddress: dealer.officeAddress,
      city: dealer.city,
      dealerType: dealer.dealerType || 'Individual Dealer',
      reraNumber: dealer.reraNumber || '',
      bio: dealer.bio || '',
      verificationStatus: dealer.verificationStatus || 'Verified',
      verified: dealer.verificationStatus === 'Verified',
    }
  }

  if (fallbackData) {
    try {
      const parsed = typeof fallbackData === 'string' ? JSON.parse(fallbackData) : fallbackData
      if (parsed && parsed.name) {
        return {
          id: parsed.id || null,
          name: parsed.name,
          agencyName: parsed.agencyName || parsed.company || 'Gujarat Real Estate',
          company: parsed.company || parsed.agencyName || 'Gujarat Real Estate',
          phone: parsed.phone || '+91 98765 43210',
          email: parsed.email || 'dealer@gujaratrealestate.com',
          profilePhoto: parsed.profilePhoto || parsed.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
          avatar: parsed.avatar || parsed.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
          officeAddress: parsed.officeAddress || parsed.address || '',
          city: parsed.city || 'Surat',
          dealerType: parsed.dealerType || 'Individual Dealer',
          reraNumber: parsed.reraNumber || parsed.rera || '',
          bio: parsed.bio || '',
          verificationStatus: parsed.verificationStatus || 'Verified',
          verified: parsed.verificationStatus === 'Verified' || parsed.verified === true,
        }
      }
    } catch (e) {}
  }

  // Default verified dealer fallback
  return {
    id: 1,
    name: 'Rahul Patel',
    agencyName: 'Surat Elite Realty & Properties',
    company: 'Surat Elite Realty & Properties',
    phone: '+91 98251 44221',
    email: 'rahul@surateliterealty.com',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    officeAddress: 'Vesu, Surat, Gujarat',
    city: 'Surat',
    dealerType: 'Individual Dealer',
    reraNumber: 'PR/GJ/SURAT/DEALER/2024/098',
    bio: 'Experienced real estate consultant in Surat specializing in prime residential villas, luxury high-rises, and investment properties across Gujarat.',
    verificationStatus: 'Verified',
    verified: true,
  }
}

export default class PropertiesController {
  /**
   * List all properties with rich filtering and dealer association
   */
  async index({ request, response }: HttpContext) {
    const {
      search,
      city,
      mode,
      type,
      bedrooms,
      priceMin,
      priceMax,
      trending,
      limit = 50,
      page = 1,
    } = request.qs()

    const query = Property.query().preload('dealer')

    if (mode) {
      query.where('mode', mode)
    }

    if (city) {
      query.where('city', city)
    }

    if (type) {
      query.where('type', type)
    }

    if (bedrooms) {
      if (bedrooms === '4' || bedrooms === '4+') {
        query.where('bedrooms', '>=', 4)
      } else {
        query.where('bedrooms', Number(bedrooms))
      }
    }

    if (priceMin) {
      query.where('price', '>=', Number(priceMin))
    }

    if (priceMax) {
      query.where('price', '<=', Number(priceMax))
    }

    if (trending === 'true' || trending === '1') {
      query.where('is_trending', true)
    }

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${search}%`)
          .orWhereILike('city', `%${search}%`)
          .orWhereILike('location', `%${search}%`)
          .orWhereILike('type', `%${search}%`)
      })
    }

    query.orderBy('id', 'asc')

    const paginated = await query.paginate(page, limit)
    const serialized = paginated.serialize()

    if (serialized && Array.isArray(serialized.data)) {
      serialized.data = serialized.data.map((item: any) => ({
        ...item,
        dealer: formatDealer(item.dealer, item.dealerData),
      }))
    }

    return response.ok(serialized)
  }

  /**
   * Get single property by ID with dealer
   */
  async show({ params, response }: HttpContext) {
    const property = await Property.query().where('id', params.id).preload('dealer').first()
    if (!property) {
      return response.notFound({ message: 'Property not found' })
    }

    const res = property.serialize()
    res.dealer = formatDealer(property.dealer, property.dealerData)
    return response.ok(res)
  }

  /**
   * Get trending properties
   */
  async trending({ response }: HttpContext) {
    const trending = await Property.query().where('is_trending', true).preload('dealer').limit(10)
    const list = trending.map((item) => {
      const s = item.serialize()
      s.dealer = formatDealer(item.dealer, item.dealerData)
      return s
    })
    return response.ok(list)
  }

  /**
   * Create a new property with dealer creation/linking
   */
  async store({ request, response }: HttpContext) {
    try {
      const allBody = request.all()

      // Handle dealer data
      let dealerId = allBody.dealerId || null
      let dealerPayload = allBody.dealer || null

      if (!dealerPayload && (allBody.dealerName || allBody.dealerPhone)) {
        dealerPayload = {
          name: allBody.dealerName,
          agencyName: allBody.dealerAgency || allBody.dealerCompany,
          phone: allBody.dealerPhone,
          email: allBody.dealerEmail,
          profilePhoto: allBody.dealerPhoto,
          officeAddress: allBody.dealerAddress,
          city: allBody.dealerCity,
          dealerType: allBody.dealerType,
          reraNumber: allBody.dealerRera,
          bio: allBody.dealerBio,
          verificationStatus: allBody.dealerStatus,
        }
      }

      if (dealerPayload && dealerPayload.name) {
        let dealer = null
        if (dealerId) {
          dealer = await Dealer.find(dealerId)
        }
        if (!dealer && dealerPayload.email) {
          dealer = await Dealer.query().where('email', dealerPayload.email).first()
        }
        if (!dealer && dealerPayload.phone) {
          dealer = await Dealer.query().where('phone', dealerPayload.phone).first()
        }

        if (dealer) {
          dealer.merge({
            name: dealerPayload.name || dealer.name,
            agencyName: dealerPayload.agencyName || dealerPayload.company || dealer.agencyName,
            phone: dealerPayload.phone || dealer.phone,
            email: dealerPayload.email || dealer.email,
            profilePhoto: dealerPayload.profilePhoto || dealerPayload.avatar || dealer.profilePhoto,
            officeAddress: dealerPayload.officeAddress || dealerPayload.address || dealer.officeAddress,
            city: dealerPayload.city || dealer.city,
            dealerType: dealerPayload.dealerType || dealer.dealerType,
            reraNumber: dealerPayload.reraNumber || dealerPayload.rera || dealer.reraNumber,
            bio: dealerPayload.bio || dealer.bio,
            verificationStatus: dealerPayload.verificationStatus || dealer.verificationStatus,
          })
          await dealer.save()
        } else {
          dealer = await Dealer.create({
            name: dealerPayload.name,
            agencyName: dealerPayload.agencyName || dealerPayload.company || 'Gujarat Real Estate',
            phone: dealerPayload.phone || '+91 98765 43210',
            email: dealerPayload.email || 'dealer@gujaratrealestate.com',
            profilePhoto:
              dealerPayload.profilePhoto ||
              dealerPayload.avatar ||
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
            officeAddress: dealerPayload.officeAddress || dealerPayload.address || null,
            city: dealerPayload.city || 'Surat',
            dealerType: dealerPayload.dealerType || 'Individual Dealer',
            reraNumber: dealerPayload.reraNumber || dealerPayload.rera || null,
            bio: dealerPayload.bio || null,
            verificationStatus: dealerPayload.verificationStatus || 'Verified',
          })
        }
        dealerId = dealer.id
        dealerPayload.id = dealer.id
      }

      const propertyData = {
        name: (allBody.name || '').trim(),
        city: allBody.city || 'Surat',
        location: allBody.location || null,
        mapUrl: allBody.mapUrl || null,
        mode: allBody.mode || 'buy',
        type: allBody.type || 'Apartment',
        price: Number(allBody.price) || 0,
        priceLabel: allBody.priceLabel || `₹${Number(allBody.price) || 0}`,
        size: allBody.size ? Number(allBody.size) : null,
        bedrooms: allBody.bedrooms !== undefined ? Number(allBody.bedrooms) : 1,
        bathrooms: allBody.bathrooms !== undefined ? Number(allBody.bathrooms) : 1,
        details: allBody.details || null,
        image: allBody.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        images: allBody.images || null,
        tag: allBody.tag || null,
        isTrending: Boolean(allBody.isTrending),
        description: allBody.description || null,
        dealerId: dealerId,
        dealerData: dealerPayload ? JSON.stringify(dealerPayload) : null,
      }

      if (!propertyData.name) {
        return response.badRequest({ message: 'Property title/name is required' })
      }

      const property = await Property.create(propertyData)
      await property.load('dealer')

      const responseObj = property.serialize()
      responseObj.dealer = formatDealer(property.dealer, property.dealerData)

      return response.created(responseObj)
    } catch (err: any) {
      console.error('Error creating property:', err)
      return response.status(400).json({
        message: err.message || 'Failed to create property in database',
        error: err.code || err.name,
      })
    }
  }

  /**
   * Update an existing property
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const property = await Property.find(params.id)
      if (!property) {
        return response.notFound({ message: 'Property not found' })
      }

      const allBody = request.all()
      let dealerId = allBody.dealerId !== undefined ? allBody.dealerId : property.dealerId
      let dealerPayload = allBody.dealer || null

      if (dealerPayload && dealerPayload.name) {
        let dealer = null
        if (dealerId) {
          dealer = await Dealer.find(dealerId)
        }
        if (!dealer && dealerPayload.email) {
          dealer = await Dealer.query().where('email', dealerPayload.email).first()
        }
        if (!dealer && dealerPayload.phone) {
          dealer = await Dealer.query().where('phone', dealerPayload.phone).first()
        }

        if (dealer) {
          dealer.merge({
            name: dealerPayload.name || dealer.name,
            agencyName: dealerPayload.agencyName || dealerPayload.company || dealer.agencyName,
            phone: dealerPayload.phone || dealer.phone,
            email: dealerPayload.email || dealer.email,
            profilePhoto: dealerPayload.profilePhoto || dealerPayload.avatar || dealer.profilePhoto,
            officeAddress: dealerPayload.officeAddress || dealerPayload.address || dealer.officeAddress,
            city: dealerPayload.city || dealer.city,
            dealerType: dealerPayload.dealerType || dealer.dealerType,
            reraNumber: dealerPayload.reraNumber || dealerPayload.rera || dealer.reraNumber,
            bio: dealerPayload.bio || dealer.bio,
            verificationStatus: dealerPayload.verificationStatus || dealer.verificationStatus,
          })
          await dealer.save()
          dealerId = dealer.id
        }
      }

      const allowedFields = [
        'name',
        'city',
        'location',
        'mode',
        'type',
        'price',
        'priceLabel',
        'size',
        'bedrooms',
        'bathrooms',
        'details',
        'image',
        'images',
        'tag',
        'isTrending',
        'description',
        'mapUrl',
      ]

      const dataToMerge: Record<string, any> = {}
      for (const field of allowedFields) {
        if (allBody[field] !== undefined) {
          dataToMerge[field] = allBody[field]
        }
      }

      if (dealerId !== undefined) {
        dataToMerge.dealerId = dealerId
      }
      if (dealerPayload) {
        dataToMerge.dealerData = JSON.stringify(dealerPayload)
      }

      property.merge(dataToMerge)
      await property.save()
      await property.load('dealer')

      const responseObj = property.serialize()
      responseObj.dealer = formatDealer(property.dealer, property.dealerData)

      return response.ok(responseObj)
    } catch (err: any) {
      console.error('Error updating property:', err)
      return response.status(400).json({
        message: err.message || 'Failed to update property in database',
        error: err.code || err.name,
      })
    }
  }

  /**
   * Delete a property
   */
  async destroy({ params, response }: HttpContext) {
    const property = await Property.find(params.id)
    if (!property) {
      return response.notFound({ message: 'Property not found' })
    }
    await property.delete()
    return response.ok({ message: 'Property deleted successfully' })
  }
}
