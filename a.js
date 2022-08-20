'use strict'
{
const doc = document ,
	canv = doc.getElementById('c') ,
	ctx = canv.getContext( '2d', {alpha:false , desynchronized:true} ) ,
	randRange = (min=0 , max=1) => Math.random() * (max - min) + +min

let w=0, h=0

const settings = {
	pixel_size : 0x40,
	hue_variation : 1/16,
	sat_variation : 1/8 * 100,
	l_variation : 1/8 * 100,
	resize_delay_ms : 1500
}

const resize = ()=>{
	w = canv.width = doc.body.clientWidth
	h = canv.height = doc.body.clientHeight

	draw_bg()
	draw_face()
}

const draw_bg = () => {
	const {
		pixel_size: size,
		hue_variation: h_var,
		sat_variation: s_var,
		l_variation: l_var
	} = settings

	const hue_base = randRange(), sat_base = 100, l_base = 50

	for (let y=0; y<h; y+=size)
		for (let x=0; x<w; x+=size)
		{
			const hue_now = hue_base + randRange(-h_var, h_var),
				sat_now = sat_base + randRange(-s_var, s_var),
				l_now = l_base + randRange(-l_var, l_var)

			ctx.fillStyle = `hsl(${hue_now}turn ${sat_now}% ${l_now}%)`
			ctx.fillRect( x,y,size,size )
		}
}

const draw_face = () => {
	const size = settings.pixel_size,
		size2 = size*2,
		size3 = size*3,
		center_x = w/2,
		center_y = h/2

	ctx.fillStyle = '#000'

	//left eye
	ctx.fillRect( center_x - size3, center_y - size2, size2, size2 )
	//right eye
	ctx.fillRect( center_x + size, center_y - size2, size2, size2 )
	//mouth (center)
	ctx.fillRect( center_x - size, center_y, size2, size3 )
	//mouth (left)
	ctx.fillRect( center_x - size2, center_y + size, size, size3 )
	//mouth (right)
	ctx.fillRect( center_x + size, center_y + size, size, size3 )
}


	let tm_ID
	resize()

	addEventListener('resize', ()=>{
		clearTimeout( tm_ID )
		tm_ID = setTimeout( resize, settings.resize_delay_ms )
	})
}