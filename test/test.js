const SolidaTube = artifacts.require('./SolidaTube.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SolidaTube', ([deployer, author]) => {
  let solidatube

  before(async () => {
    solidatube = await SolidaTube.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await solidatube.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await solidatube.name()
      assert.equal(name, 'SolidaTube')
    })
  })

  describe('videos', async () => {
    let result, videoCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await solidatube.uploadVideo(hash, 'Video title', { from: author })
      videoCount = await solidatube.videoCount()
    })

    //check event
    it('creates videos', async () => {
      // SUCESS
      assert.equal(videoCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'Video title', 'title is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Video must have hash
      await solidatube.uploadVideo('', 'Video title', { from: author }).should.be.rejected;

      // FAILURE: Video must have title
      await solidatube.uploadVideo('Video hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists videos', async () => {
      const video = await solidatube.videos(videoCount)
      assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(video.hash, hash, 'Hash is correct')
      assert.equal(video.title, 'Video title', 'title is correct')
      assert.equal(video.author, author, 'author is correct')
    })
  })
})