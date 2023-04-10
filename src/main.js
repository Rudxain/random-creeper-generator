//@ts-check
'use strict'
// for debugging
const RCG_settings = (() => {
	const doc = document

	const canv = /**@type {HTMLCanvasElement}*/(doc.getElementById('c'))
	const ctx = /**@type {CanvasRenderingContext2D}*/(canv.getContext('2d', { alpha: false, desynchronized: true }))

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
		hue_variation: 1 / 0x10,
		sat_variation: 100 / 8,
		l_variation: 100 / 8,
		resize_delay_ms: 0x200
	}

	const resize = () => {
		const pixel_size = divTrunc(Math.min(
			canv.width = doc.body.clientWidth,
			canv.height = doc.body.clientHeight
		), 8)

		const
			center_x = divTrunc(canv.width, 2),
			center_y = divTrunc(canv.height, 2)

		draw_bg(pixel_size, center_x, center_y)
		draw_face(pixel_size, center_x, center_y)
	}

	/**
	@param {number} pix_size
	@param {number} c_x
	@param {number} c_y
	*/
	const draw_bg = (pix_size, c_x, c_y) => {
		const pix_size2 = pix_size * 2

		const {
			hue_variation: h_var,
			sat_variation: s_var,
			l_variation: l_var
		} = settings

		const
			hue_base = randRange(),
			sat_base = 100,
			l_base = 50

		for (const y of range((c_y - pix_size2) % pix_size - pix_size, canv.height, pix_size))
			for (const x of range((c_x - pix_size2) % pix_size - pix_size, canv.width, pix_size)) {
				// should this be replaced by Perlin noise?
				const
					hue_now = hue_base + randRange(-h_var, h_var),
					sat_now = sat_base + randRange(-s_var, s_var),
					l_now = l_base + randRange(-l_var, l_var)

				ctx.fillStyle = `hsl(${hue_now}turn ${sat_now}% ${l_now}%)`
				ctx.fillRect(x, y, pix_size, pix_size)
			}
	}

	/**
	@param {number} pix_size
	@param {number} x
	@param {number} y
	*/
	const draw_face = (pix_size, x, y) => {
		const
			s2 = pix_size * 2,
			s3 = pix_size + s2

		ctx.fillStyle = '#000'

		// left eye
		ctx.fillRect(x - s3, y - s2, s2, s2)
		// right eye
		ctx.fillRect(x + pix_size, y - s2, s2, s2)
		// mouth (center)
		ctx.fillRect(x - pix_size, y, s2, s3)
		// mouth (left)
		ctx.fillRect(x - s2, y + pix_size, pix_size, s3)
		// mouth (right)
		ctx.fillRect(x + pix_size, y + pix_size, pix_size, s3)
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