//@ts-check
'use strict'
// for debugging
const RCG_settings = (() => {
	const doc = document

	const canv = /**@type {HTMLCanvasElement}*/(doc.getElementById('c'))
	const ctx = /**@type {CanvasRenderingContext2D}*/(canv.getContext('2d', { alpha: false, desynchronized: true }))

	/**
	@param {boolean} condition
	@param {string} message
	*/
	const assert = (condition, message) => { if (!condition) throw new Error(message) }

	// for consistency with ECMAScript,
	// I decided to define truncated division, rather than floored
	/**
	divide `n` by `d`, then `trunc`ate.
	@param {number} n numerator or dividend
	@param {number} d denominator or divisor
	*/
	const divTrunc = (n, d) => Math.trunc(n / d)

	/**
	Generates a sequence of integers,
	from `init` to `end`, with `step` increments.
	@param init initializer (inclusive)
	@param end max value (exclusive)
	@param step increment distance
	*/
	const range = function* (init = 0, end = 0, step = 1) {
		const
			NOT_INT_MSG = ' is not int',
			NEG_MSG = ' is negative, expected unsigned'

		if (!Number.isInteger(init))
			throw new RangeError('`init`' + NOT_INT_MSG)
		// there's no problem if negative

		if (!Number.isInteger(end))
			throw new RangeError('`count`' + NOT_INT_MSG)
		if (end < 0)
			throw new RangeError('`count`' + NEG_MSG)

		if (!Number.isInteger(step))
			throw new RangeError('`inc`' + NOT_INT_MSG)
		if (step < 0)
			throw new RangeError('`inc`' + NEG_MSG)

		for (let i = init; i < end; i += step) yield i
	}

	/**
	Returns a pseudo-random `number` between `min` and `max`.
	*/
	const randRange = (min = 0, max = 1) => Math.random() * (max - min) + min

	const settings = {
		pixel_size: 0x40,
		hue_variation: 1 / 0x10,
		sat_variation: 1 / 8 * 100,
		l_variation: 1 / 8 * 100,
		resize_delay_ms: 1500
	}

	const resize = () => {
		canv.width = doc.body.clientWidth
		canv.height = doc.body.clientHeight

		draw_bg()
		draw_face()
	}

	const draw_bg = () => {
		const {
			pixel_size: size1,
			hue_variation: h_var,
			sat_variation: s_var,
			l_variation: l_var
		} = settings

		const size2 = size1 * 2

		const
			hue_base = randRange(),
			sat_base = 100,
			l_base = 50

		const
			center_x = divTrunc(canv.width, 2),
			center_y = divTrunc(canv.height, 2)

		for (const y of range((center_y - size2) % size1 - size1, canv.height, size1))
			for (const x of range((center_x - size2) % size1 - size1, canv.width, size1)) {
				// should this be replaced by Perlin noise?
				const
					hue_now = hue_base + randRange(-h_var, h_var),
					sat_now = sat_base + randRange(-s_var, s_var),
					l_now = l_base + randRange(-l_var, l_var)

				ctx.fillStyle = `hsl(${hue_now}turn ${sat_now}% ${l_now}%)`
				ctx.fillRect(x, y, size1, size1)
			}
	}

	const draw_face = () => {
		const
			size1 = settings.pixel_size,
			size2 = size1 * 2,
			size3 = size1 + size2

		assert(size3 === size1 * 3, 'math went wrong')

		const
			center_x = divTrunc(canv.width, 2),
			center_y = divTrunc(canv.height, 2)

		ctx.fillStyle = '#000'

		// left eye
		ctx.fillRect(center_x - size3, center_y - size2, size2, size2)
		// right eye
		ctx.fillRect(center_x + size1, center_y - size2, size2, size2)
		// mouth (center)
		ctx.fillRect(center_x - size1, center_y, size2, size3)
		// mouth (left)
		ctx.fillRect(center_x - size2, center_y + size1, size1, size3)
		// mouth (right)
		ctx.fillRect(center_x + size1, center_y + size1, size1, size3)
	}

	const main = () => {
		resize()

		let tm_ID
		addEventListener('resize', () => {
			clearTimeout(tm_ID)
			tm_ID = setTimeout(resize, settings.resize_delay_ms)
		})
	}
	main()

	return settings
})()