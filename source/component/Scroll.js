import vertexShader from "./shader-scroll/vertex.glsl?raw";
import fragmentShader from "./shader-scroll/fragment.glsl?raw";
import * as three from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export default class Scroll {

	#scroll;

	/**
	 * 构造线段。
	 * @param { number } length - 线段的长度，比如100。
	 * @param { number } thickness - 线段的宽度，比如1.
	 * @returns { Object } - 线段实例。
	 */
	constructor ( length, thickness ) {

		const flare = new Flare( Number( length ), Number( length ) );

		const createLine = thickness === 1 ? createThinLine : createBoldLine;
		const line = createLine( length, thickness );
		const group = new three.Group();

		group.add( flare, line );

		this.#scroll = group;

	}

	/**
	 * 获取实例。
	 * @returns { Object } - Group实例。
	 */
	get () {

		return this.#scroll;

	}

	/**
	 * 设置位置。
	 * @param { number } x - x坐标。
	 * @param { number } y - y坐标。
	 * @param { number } z - z坐标。
	 */
	setPosition ( x, y, z ) {

		this.get().position.set( x, y, z );

	}

	/**
	 * 缩放至原始大小的value倍。
	 * @param { number } value - 缩放倍数。
	 */
	setScale ( value ) {

		this.get().scale.set( value, value, value );

	}

}

/**
 * 构造细线条。
 * @param { number } length - 线段的长度，比如100。
 * @param { number } thickness - 线段的宽度，其宽度恒定为1。
 * @returns { Object } - Line实例。
 */
function createThinLine ( length, thickness ) {

	const positions = [
		0, length / 2, 0,
		0, - length / 2, 0,
	];
	const colors = [
		Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
		Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1,
	];
	const geometry = new three.BufferGeometry();

	geometry.setAttribute( "position", new three.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( "color", new three.Float32BufferAttribute( colors, 3 ) );
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	const material = new three.LineBasicMaterial( {
		linewidth: 1,
		vertexColors: true,
		linecap: "square",
	} );
	const line = new three.Line( geometry, material );

	return line;

}

/**
 * 构造粗线条。
 * @param { number } length - 线段的长度，比如100.
 * @param { number } thickness - 线段的宽度，比如1。
 * @returns { Object } - Mesh实例。
 */
function createBoldLine ( length, thickness ) {

	const points = [
		new three.Vector2( 0, length / 2 ),
		new three.Vector2( 0, - length / 2 ),
	];
	const material = new three.MeshBasicMaterial( { side: three.DoubleSide, vertexColors: true } );
	const style = SVGLoader.getStrokeStyle( 2, "rgb(255,255,255)" );
	const geometry = SVGLoader.pointsToStroke( points, style );

	const colors = [];

	let count = geometry.getAttribute( "position" ).count;

	while ( count -- ) colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );

	geometry.setAttribute( "color", new three.Float32BufferAttribute( colors, 3 ) );

	const line = new three.Mesh( geometry, material );

	return line;

}

function Flare ( width, height ) {

	const material = new three.RawShaderMaterial( {
		wireframe: false,
		transparent: true,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	} );
	const geometry = new three.PlaneGeometry( 1, 1, 1, 1 );
	const mesh = new three.Mesh( geometry, material );

	mesh.scale.set( width, height, 1 );

	return mesh;

}
